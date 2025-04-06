// import {Queue,Worker} from "bullmq";
// import type {AlertOptions,EmailResponse,QueueStatus} from "../types.ts";
// import {MailClient} from "../index.ts";
// import {createClient} from "redis";
// import type {RedisClientType} from "redis";
//
// export class QueueService {
//     private queue: Queue;
//     private worker: Worker;
//     private mailClient: MailClient;
//
//     constructor(emailService:MailClient,redisClient : RedisClientType) {
//         this.mailClient = emailService;
//
//         const redisConnection = redisClient instanceof createClient ? redisClient : new createClient(redisClient.options as any);
//
//
//
//     }
//
//
// }
//
