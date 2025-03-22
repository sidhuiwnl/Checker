import { randomUUIDv7,type ServerWebSocket } from "bun"
import {prismaClient} from "db/client";
import type {IncomingMessage, SignupIncomingMessage} from "common/types";
import {PublicKey} from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";


const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] = [];

const COST_PER_VALIDATION = 100;

Bun.serve({
    fetch(req,server){
        if(server.upgrade(req)){
            return
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    port : 8081,
    websocket : {
        async message(ws : ServerWebSocket<unknown>,message:  string){
            const data : IncomingMessage = JSON.parse(message);

            if(data.type === "signup"){
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                if(verified){
                    await signuphandler(ws,data.data)
                }


            }else if(data.type === "validate"){

                CALLBACKS[data.data.callbackId]?.(data)

                delete CALLBACKS[data.data.callbackId];
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    }
})


async function signuphandler(ws : ServerWebSocket<unknown>,{ ip,publicKey,signedMessage,callbackId } : SignupIncomingMessage){

    // to check the validator aldreay exist,

    const validatorDb = await prismaClient.validator.findFirst({
        where : {
           publickey : publicKey,
        }
    })

    if(validatorDb){
        // if yes, they exist we sent them callbackid,validotorId
        ws.send(JSON.stringify({
            type: "signup",
            data : {
                validatorId : validatorDb.id,
                callbackId : callbackId,
            }
        }))

        // and we push the validator to the global available validator
        availableValidators.push({
            validatorId : validatorDb.id,
            socket  : ws,
            publicKey : validatorDb.publickey,
        })

        return
    }
    // if they not signed up aldreay we just create a new entry
    const validator = await prismaClient.validator.create({
        data : {
            ip,
            publickey : publicKey,
            location : "unknown",
        }
    })

    ws.send(JSON.stringify({
        type: "signup",
        data : {
            validatorId : validator.id,
            callbackId : callbackId,
        }
    }))

    availableValidators.push({
        validatorId : validator.id,
        socket : ws,
        publicKey : validator.publickey,
    })


}


async function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes(),
    );

    return result;
}


setInterval(async () => {

    // to collect all the websites where the diabled is false

    const websiteToMonitor = await prismaClient.website.findMany({
        where : {
            disabled : false
        }
    })

    for(const website of websiteToMonitor){
        availableValidators.forEach((validator) => {
            const callbackId = randomUUIDv7()

            validator.socket.send(JSON.stringify({
                type : "validate",
                data : {
                    url : website.url,
                    callbackId : callbackId,
                }
            }))

            CALLBACKS[callbackId] = async (data : IncomingMessage) => {
                if(data.type === "validate"){
                    const { validatorId,status,signedMessage,latency } = data.data;

                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }

                    await prismaClient.$transaction(async (tx) => {
                        await tx.websiteTicksTable.create({
                            data : {
                                websiteId : website.id,
                                latency,
                                status,
                                createdAt : new Date(),
                                validatorId
                            }
                        })

                        await tx.validator.update({
                            where : {
                                id : validatorId
                            },
                            data : {
                                pendingPayouts : { increment : COST_PER_VALIDATION}
                            }
                        })


                    })
                }


            }


        })


    }

},60 * 1000)