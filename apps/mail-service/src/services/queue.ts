import Bull from "bull";
import type {NotificationType} from "./mail-service.ts";

export interface QueueItem{
    type : NotificationType;
    data : Record<string, any>

}

export class EmailQueue {
    private queue : Bull.Queue;

    constructor(redisUrl : string) {
        this.queue = new Bull("email-queue", redisUrl);

    }

    async add(item : QueueItem) : Promise<void>{
        await this.queue.add(item,{
            attempts : 3,
            backoff : {
                type: 'exponential',
                delay: 5000
            }
        })
    }

    async process(handler : (item : QueueItem) => Promise<void>) : Promise<void>{
        this.queue.process(async (job) => {
            await handler(job.data);
        })
    }

    async gracefulhutdown() : Promise<void>{
        await this.queue.close();
    }
}

