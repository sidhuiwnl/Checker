import { Resend } from 'resend';

import {type MailProvider, type EmailOptions, MailStatus} from "../services/mail-interface.ts";

export class ResendAdapter implements MailProvider{
    private client : Resend;
    private defaultForm : string;

    constructor(apikey : string,defaultFrom : string) {
        this.client = new Resend(apikey);
        this.defaultForm = defaultFrom;
    }

    async sendMail(options : EmailOptions) : Promise<{id : string } | Error >{
        try {
            const response = await this.client.emails.send({
                from : options.from || this.defaultForm,
                to : options.to,
                subject: options.subject || "",
                html: options.html,
                text: options.text,

            })

            if(response.error){
                return new Error(`Resend error: ${response.error.message}`);
            }
            return {
                id : response?.data?.id as string,
            }
        }catch (error) {
            return error instanceof Error ? error : new Error(String(error));
        }
    }

    async getStatus(messageId : string) : Promise<MailStatus | Error>{
        try {
            const response = await this.client.emails.get(messageId);
            if(response.error){
                return new Error(`Resend error: ${response.error.message}`);
            }
            return response?.data?.last_event as MailStatus;

        }catch (error) {
            return error instanceof Error ? error : new Error(String(error));
        }
    }
}