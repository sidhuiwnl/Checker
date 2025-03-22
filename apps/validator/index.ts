import { randomUUIDv7 } from "bun";
import type {OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage} from "common/types";
import {Keypair} from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";


let validatorId : string | null = null;




let CALLBACKS : {
    [callbackId : string] : (data : SignupOutgoingMessage ) => void
} = {

}


async function main(){
    const ws = new WebSocket("ws://127.0.0.1:8081");

    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    )

    ws.onmessage = async(event ) => {
        const data : OutgoingMessage = JSON.parse(event.data);

        if(data.type === "signup"){
            CALLBACKS[data.data.callbackId]?.(data.data)
            console.log(CALLBACKS[data.data.callbackId]);

            delete CALLBACKS[data.data.callbackId]
        }else if(data.type === "validate"){
            await validatorHandler(ws,data.data,keypair)
        }

    }

    ws.onopen  = async () => {


        // the validator first send mesage with data containing
        //  type: "signup",
        //             data  : {
        //                 callBackId,
        //                 ip : '127.0.0.1',
        //
        //             }

        const callBackId = randomUUIDv7();

       CALLBACKS[callBackId] = (data : SignupOutgoingMessage) =>{
            validatorId = data.validatorId;
        }

        const signedMessage = await signMessage(`Signed message for ${callBackId}, ${keypair.publicKey}`, keypair);

        ws.send(JSON.stringify({
            type: "signup",
            data  : {
                callBackId,
                ip : '127.0.0.1',
                publickey : keypair.publicKey,
                signedMessage
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

        console.error(e);
    }

}

async function signMessage(message: string, keypair: Keypair) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);

    return JSON.stringify(Array.from(signature));
}

main()

setInterval(() =>{

},10000)