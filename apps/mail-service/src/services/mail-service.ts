import type {EmailOptions, MailProvider} from "./mail-interface.ts";
import type {EmailQueue} from "./queue.ts";
import {renderTemplate} from "../templates";

export type NotificationType =
    | 'monitor-down'
    | 'monitor-up'
    | 'high-latency'
    | 'monitor-created'
    | 'weekly-report';

export interface NotificationOptions {
    type: NotificationType;
    data: Record<string, any>;
    to: string | string[];

}


export class MailService{
    private provider : MailProvider;
    private queue  : EmailQueue;
    private defaultFrom : string;

    constructor(provider : MailProvider, queue : EmailQueue, defaultFrom : string) {
        this.provider = provider;
        this.queue = queue;
        this.defaultFrom = defaultFrom;
    }

    async sendMail(options : EmailOptions) : Promise<{ id : string} | Error>{
        return this.provider.sendMail({
            ...options,
            from : options.from || this.defaultFrom,
        });
    }

    async sendNotification(options : NotificationOptions) : Promise<void> {
        const { to,type,data } = options;

        await this.queue.add({
            type,
            data : {
                to,
                ...data
            }
        })
    }

    async processQueueItem(item : { type : NotificationType,data : any }) : Promise<void>{
        const { type,data } = item;
        const { to,...templateData } = data

        const emailContent = await renderTemplate(type,templateData);

        const result = await this.sendMail({
            to,
            subject : emailContent.subject,
            html : emailContent.html,
            text : emailContent.text,
        })

        if(result instanceof Error){
            throw result
        }
    }
}
