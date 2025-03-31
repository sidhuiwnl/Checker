import { randomUUIDv7, type ServerWebSocket } from "bun";
import type {IncomingMessage, SignupIncomingMessage, ValidateIncomingMessage, ValidationResult} from "common/types";
import { prismaClient } from "db/client";




const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown> }[] = [];



const CALLBACKS = new Map<string,(data : ValidateIncomingMessage) => Promise<void>>();


Bun.serve({
    async fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    port: 8081,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);

            console.log("Received message", data);

            if (data.type === 'signup') {
                await signupHandler(ws, data.data);

            } else if (data.type === 'validate') {
                const callback = CALLBACKS.get(data.data.callbackId);

                console.log("the callback data", callback);
                if(callback){
                    try{
                        await callback(data.data);
                    }finally {
                        CALLBACKS.delete(data.data.callbackId);
                    }


                }
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    },
});

async function signupHandler(ws: ServerWebSocket<unknown>, { ip, callbackId,location }: SignupIncomingMessage) {
    const validatorDb = await prismaClient.validator.findFirst({
        where: {
           ip
        },
    });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
        });
        return;
    }

    //TODO: Given the ip, return the location
    const validator = await prismaClient.validator.create({
        data: {
            ip,
            location
        },
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
    });
}



setInterval(async () => {
    const websitesToMonitor = await prismaClient.website.findMany({
        where: {
            disabled: false,
        },
    });

    for (const website of websitesToMonitor) {
        console.log("The website receive",website)
        availableValidators.forEach(validator => {


            const callbackId = randomUUIDv7();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);

            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                },
            }));

            CALLBACKS.set(callbackId, async (data) => {
                const { validatorId, status, latency, dataTransfer, TLShandshake, connection, total } = data;

                console.log("The total", total);

                await prismaClient.websiteTicksTable.create({
                    data: {
                        websiteId: website.id,
                        validatorId: validatorId,
                        status: status,
                        latency: latency,
                        createdAt: new Date(),
                        total: Number(total),
                        tlsHandshake: Number(TLShandshake),
                        connection: Number(connection),
                        dataTransfer: Number(dataTransfer),
                    }
                });
            });
        });
    }
}, 60 * 1000);