import { randomUUIDv7 } from "bun";
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common/types";

import {checker} from "./utils.ts";

const CALLBACKS: {[callbackId: string]: (data: SignupOutgoingMessage) => void} = {}

let validatorId: string | null = null;



async function main() {

    const ws = new WebSocket("ws://localhost:8081");

    ws.onmessage = async (event) => {
        const data: OutgoingMessage = JSON.parse(event.data);
        if (data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data)
            delete CALLBACKS[data.data.callbackId];
        } else if (data.type === 'validate') {
            await validateHandler(ws, data.data);
        }
    }

    ws.onopen = async () => {
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


main();

setInterval(async () => {

}, 10000);


