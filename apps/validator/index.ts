import { randomUUIDv7 } from "bun";
import type {OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage} from "common/types";
import {Keypair} from "@solana/web3.js";

let validatorId : string | null = null;




let callbacks : {
    [callbackId : string] : (data : SignupOutgoingMessage ) => void
} = {

}


async function main(){
    const ws = new WebSocket("ws://127.0.0.1:8080");

    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    )

    ws.onmessage = async(event ) => {
        const data : OutgoingMessage = JSON.parse(event.data);

        if(data.type === "signup"){
            callbacks[data.data.callbackId]?.(data.data)

            console.log(callbacks[data.data.callbackId]);

            delete callbacks[data.data.callbackId]
        }else if(data.type === "validate"){
            await validatorHandler(ws,data.data,keypair)
        }

    }

    ws.onopen  = async () => {
        const callBackId = randomUUIDv7()

        callbacks[callBackId] = (data : SignupOutgoingMessage) =>{
            validatorId = data.validatorId;
        }


        ws.send(JSON.stringify({
            type: "signup",
            data  : {
                callBackId,
                ip : '127.0.0.1',

            }
        }))
    }
}


async function validatorHandler(ws : WebSocket,{ url,callbackId,websiteId } : ValidateOutgoingMessage,keypair : Keypair){
    const startTime = Date.now();

    try {
        const response = await fetch(url);
        const endTime = Date.now();
        const latency  = endTime - startTime;
        const status = response.status;

        ws.send(JSON.stringify({
            type : "validate",
            data : {
                callbackId,
                status : status === 200 ? "GOOD" : "BAD",
                latency,
                websiteId,
                validatorId
            }
        }))
    }catch(e){
        ws.send(JSON.stringify({
            type : "validate",
            data : {
                callbackId,
                status : "BAD",
                latency : 1000,
                websiteId,
                validatorId
            }
        }))
    }

}

main()

setInterval(() =>{

},10000)