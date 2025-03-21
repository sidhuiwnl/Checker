import { randomUUIDv7,type ServerWebSocket } from "bun"
import {prismaClient} from "db/client";
import type {IncomingMessage, SignupIncomingMessage} from "common/types";

const callbacks : { [callbackId: string]: (data: IncomingMessage) => void } = {}

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] = [];

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

            }else if(data.type === "validate"){

            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    }
})


async function signuphandler(ws : ServerWebSocket<unknown>,{ ip,publicKey,signedMessage,callbackId } : SignupIncomingMessage){
    const validatorDb = await prismaClient.validator.findFirst({
        where : {
           publickey : publicKey,
        }
    })

    if(validatorDb){

        ws.send(JSON.stringify({
            type: "signup",
            data : {
                    validatorId : validatorDb.id,
                callbackId : callbackId,
            }
        }))
        availableValidators.push({
            validatorId : validatorDb.id,
            socket  : ws,
            publicKey : validatorDb.publickey,
        })

        return
    }

}