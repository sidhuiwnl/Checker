import { Resend } from 'resend';
import type {AlertOptions} from "./types.ts";
import dotenv from "dotenv";

dotenv.config();

 export class MailClient{
    private resend : Resend
    private defaultFrom : string;


    constructor(apiKey : string,defaultFrom : string = process.env.RESEND_DEFAULT_FROM as string) {
        this.resend = new Resend(apiKey);
        this.defaultFrom = defaultFrom;

    }

    async sendAlert(options : AlertOptions) : Promise<{ success : boolean; messageId? : string}> {
        try {
            const response = await this.resend.emails.send({
                from : this.defaultFrom,
                to : options.to,
                subject : options.subject || "Alert Notification",
                html : options.html || this.generateDefaultHtml(options),
                text : options.text || this.generateDefaultText(options),
            })

            if(response.error){
                return {
                    success : false
                }
            }
            return {
                success : true,
                messageId : response.data?.id
            }
        }catch(error) {
            return { success: false };
        }
    }

    async sendMonitorDownAlert(options : AlertOptions) : Promise<{ success : boolean,messageId? : string}>{
        const subject = options.subject || `Monitor Down: ${options.url}`;
        const html = options.html || `
      <h1>Monitor Down Alert</h1>
      <p>Your monitor for <strong>${options.url}</strong> is down.</p>
      ${options.monitorId ? `<p><strong>Monitor ID:</strong> ${options.monitorId}</p>` : ''}
      ${options.error ? `<p><strong>Error:</strong> ${options.error}</p>` : ''}
      <p><strong>Time detected:</strong> ${options.timestamp || new Date().toISOString()}</p>
    `;

        return this.sendAlert({
            ...options,
            type : "monitor-down",
            subject,
            html,
        })

    }

    private generateDefaultHtml(options: AlertOptions): string {
        return `
      <h1>${options.subject || 'Alert Notification'}</h1>
      ${options.url ? `<p><strong>URL:</strong> ${options.url}</p>` : ''}
      ${options.monitorId ? `<p><strong>Monitor ID:</strong> ${options.monitorId}</p>` : ''}
      ${options.error ? `<p><strong>Error:</strong> ${options.error}</p>` : ''}
      <p><strong>Time:</strong> ${options.timestamp || new Date().toISOString()}</p>
    `;
    }

    private generateDefaultText(options: AlertOptions): string {
        return `
      ${options.subject || 'Alert Notification'}\n\n
      ${options.url ? `URL: ${options.url}\n` : ''}
      ${options.monitorId ? `Monitor ID: ${options.monitorId}\n` : ''}
      ${options.error ? `Error: ${options.error}\n` : ''}
      Time: ${options.timestamp || new Date().toISOString()}
    `;
    }
}

