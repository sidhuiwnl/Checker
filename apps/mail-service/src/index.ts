import {ResendAdapter} from "./adapters/resend-adapter.ts";
import {MailService} from "./services/mail-service.ts";
import {EmailQueue} from "./services/queue.ts";

type Config = {
    resendApiKey : string;
    defaultFrom : string;
    redisUrl : string;
}

export async function createMailService( { resendApiKey,defaultFrom,redisUrl } : Config) : Promise<MailService>{
    const mailProvider = new ResendAdapter(resendApiKey,defaultFrom);

    const emailQueue = new EmailQueue(redisUrl);

    const mailService = new MailService(mailProvider,emailQueue,defaultFrom);

    emailQueue.process(async (item) => {
        await mailService.processQueueItem(item);

    })

    return mailService

}