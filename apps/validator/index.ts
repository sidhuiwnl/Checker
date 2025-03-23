import { randomUUIDv7 } from "bun";
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common/types";
import {createClient, type RedisClientType} from "redis";

import {checker} from "./utils.ts";

const CALLBACKS: {
    [callbackId: string] :
        (data: SignupOutgoingMessage) => void
} = {}

let ws : WebSocket ;
let validatorId: string | null = null;
let redisClient : RedisClientType | null = null;


async function initRedis() {
    try {
        redisClient = createClient({ url: process.env.REDIS_URL  });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        await redisClient.connect();
        console.log('Connected to Redis');


        const storedValidatorId = await redisClient.get('validatorId');
        if (storedValidatorId) {
            validatorId = storedValidatorId;
            console.log('Loaded validatorId from Redis:', validatorId);
        }

        return true;
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
        return false;
    }
}



async function main() {

    await initRedis();

    ws = new WebSocket("ws://localhost:8081");

    ws.onmessage = async (event) => {

        const data: OutgoingMessage = JSON.parse(event.data);


        if (data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data);

            delete CALLBACKS[data.data.callbackId];

            if(redisClient && data.data.validatorId){
                await redisClient.set("validatorId",data.data.validatorId);

            }

        } else if (data.type === 'validate') {
            await redisClient?.rPush("validationQueue",JSON.stringify(data.data))
        }
    }

    ws.onopen = async () => {

        if(!validatorId){
            const callbackId = randomUUIDv7();

            CALLBACKS[callbackId] = (data: SignupOutgoingMessage) => {
                validatorId = data.validatorId;
            }

            ws.send(JSON.stringify({
                type: 'signup',
                data: {
                    callbackId,
                    ip: '127.0.0.1',
                    publicKey: "random",
                },
            }));
        }else {
            console.log('Using existing validatorId:', validatorId);
        }

    }
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket closed');
    };
}


async function processQueue(){
    if(!redisClient || ws.readyState !== WebSocket.OPEN){
        setTimeout(processQueue, 1000);
        return
    }
    const queueItem = await redisClient.lPop("validationQueue");

    if(queueItem){
        const validateData : ValidateOutgoingMessage = JSON.parse(queueItem)
        await validateHandler(ws, validateData);
        setImmediate(processQueue);
    }else {
        setTimeout(processQueue, 1000);
    }
}


async function validateHandler(ws: WebSocket, { url, callbackId, websiteId }: ValidateOutgoingMessage) {
    console.log(`Validating ${url}`);
    const startTime = Date.now();


    try {


        const { status,dataTransfer,TLShandshake,connection,total} : { status : number,dataTransfer: number,TLShandshake : number,connection : number,total : number} = await checker(url);



        const endTime = Date.now();
        const latency = endTime - startTime;

        console.log(url);
        console.log(status);
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: status === 200 ? 'GOOD' : 'BAD',
                latency,
                websiteId,
                validatorId,
                dataTransfer,
                TLShandshake,
                connection,
                total
            },
        }));
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status:'BAD',
                latency: 1000,
                websiteId,
                validatorId,
            },
        }));
        console.error(error);
    }
}


main().then(() => processQueue() );


setInterval(async () => {

}, 10000);



process.on('SIGINT', async () => {
    console.log('Shutting down...');
    if (redisClient) {
        await redisClient.quit();
    }
    process.exit(0);
});

