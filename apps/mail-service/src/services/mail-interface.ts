export interface EmailOptions{
    to : string | string[];
    subject? : string;
    html : string;
    text? : string;
    from? : string;

}

export interface MailProvider{
    sendMail(options : EmailOptions) : Promise<{ id : string } | Error>;
    getStatus(messageId  : string) : Promise<MailStatus | Error>;
}

export enum MailStatus   {
    bounced = "bounced" ,
 canceled = "canceled" ,
clicked = "clicked" ,
 complained = "complained" ,
 delivered  = "delivered" ,
 delivery_delayed = "delivery_delayed" ,
 opened  = "opened" ,
 queued  = "queued" ,
 scheduled = "scheduled" ,
}