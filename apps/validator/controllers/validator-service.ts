import {randomUUIDv7} from "bun";
import {WebSocket} from "ws";
import {createClient,type RedisClientType} from "redis";
import {checker, getLocalIpAddress} from "../utils.ts";
import type {SignupOutgoingMessage, OutgoingMessage, ValidateOutgoingMessage, ValidationResult} from "common/types";
import {WS_URL} from "../constant.ts";

export class Validator{
    private validatorId : string | null = null;
    private redisClient : RedisClientType | null = null;
    private ws : WebSocket | null = null;
    private callbacks = new Map<string,(data : SignupOutgoingMessage) => void>();

    constructor(private redisUrl : string) {
    }

    async start(){
        try {
            await this.initRedis();
            await this.initWebSocket();
            this.processQueue().catch(err => console.error("Queue processing error", err));
        }catch(err){
            console.error(err);
        }
    }

    private async initRedis() : Promise<void> {
        this.redisClient = createClient({
            url : this.redisUrl
        });

        this.redisClient?.on("error", (err) => {
            console.error('Redis Client Error:', err);
        })

        await this.redisClient?.connect();

        console.log('✅ Connected to Redis');

        const storedValidatorId = await this.redisClient.get("validatorId");
        if(storedValidatorId){
            this.validatorId = storedValidatorId;
            console.log('🔑 Loaded validatorId:', this.validatorId);
        }
    }

    private async initWebSocket() : Promise<void> {
        this.ws = new WebSocket(WS_URL);

        this.ws.on("open",() => this.handleWebsocketOpen())
        this.ws.on("message",(data) => this.handleWebSocketMessage(data));
        this.ws.on('error', (err) => console.error('WebSocket Error:', err));
        this.ws.on('close', () => console.log('WebSocket Closed'));
    }

    private  handleWebsocketOpen(){
        if(!this.validatorId){
            this.registerValidator()
        }else {
            this.registerValidator()
        }
    }

    private registerValidator(){
        const callbackId = randomUUIDv7();
        const validatorIp = getLocalIpAddress();

        this.callbacks.set(callbackId,(data) => {
            this.validatorId = data.validatorId;
            this.saveValidatorId(data.validatorId);
        })

        this.sendMessage({
            type : "signup",
            data : {
                callbackId : callbackId,
                location : "US",
                ip : validatorIp,
                validatorId : this.validatorId as string,
            }
        })


    }

    private async saveValidatorId(validatorId : string){
        if(this.redisClient){
           await this.redisClient.set("validatorId",validatorId, {
               EX : 3600
           })
            console.log('💾 Saved validatorId to Redis');
        }
    }

    private handleWebSocketMessage(data : WebSocket.RawData){
        try {
            const buffer = data instanceof Buffer ? data : Buffer.from(data as ArrayBuffer);
            const message: OutgoingMessage = JSON.parse(buffer.toString());

            switch (message.type) {
                case "signup":
                    this.handleSignUp(message.data);
                    break;
                case "validate":
                    this.handleValidation(message.data);
                    break;
                default:
                    console.warn('⚠️ Unknown message type:', message);
            }

        }catch(err){
            console.error('❌ Failed to parse WebSocket message:');
        }
    }

    private handleSignUp(data : SignupOutgoingMessage){
        const callback = this.callbacks.get(data.callbackId);
        if(callback){
            callback(data);
            this.callbacks.delete(data.callbackId);
        }

    }

    private async handleValidation(data : ValidateOutgoingMessage){
        if(this.redisClient){
            await this.redisClient.rPush("validationQueue",JSON.stringify(data))
        }
    }

    private async processQueue(){
        if(!this.redisClient || !this.ws || this.ws.readyState !== WebSocket.OPEN){
            setTimeout(()=>{
                this.processQueue()
            },10000)
            return;
        }
        try{
            const queueItem = await this.redisClient.lPop("validationQueue");
            if(queueItem){
                    const validateData : ValidateOutgoingMessage = JSON.parse(queueItem);
                    await this.validateHandler(validateData);
                setImmediate(() => this.processQueue());
            }else {
                setTimeout(() => this.processQueue(), 10000);
            }
        }catch(err){
            console.error('❌ Queue processing error:');
            setTimeout(() => this.processQueue(), 10000);
        }
    }

    private async validateHandler(data : ValidateOutgoingMessage){
        const startTime = Date.now();

        try{
            const result= await checker(data.url);
            const latency = Date.now() - startTime;

            const  { status : _, ...rest } = result;

            const response : ValidationResult = {
                callbackId : data.callbackId,
                status : result.status === 200 ? "GOOD" : "BAD",
                latency,
                websiteId: this.validatorId!,
                validatorId: this.validatorId,
                ...rest

            }

            this.sendMessage({
                type : "validate",
                data : response
            })
        }catch(err){
            this.sendMessage({
                type : "validate",
                data : {
                    callbackId : data.callbackId,
                        status: 'BAD',
                        latency: 1000,
                        websiteId: data.websiteId,
                        validatorId: this.validatorId,
                }
            })
        }
    }




    private sendMessage(message : OutgoingMessage | { type : "validate"; data : ValidationResult}){
        if(this.ws && this.ws.readyState === WebSocket.OPEN){
            this.ws.send(JSON.stringify(message));
        }else {
            console.error('🚫 WebSocket not ready');
        }
    }


    async shutdown() {
        if (this.ws) this.ws.close();
        if (this.redisClient) await this.redisClient.quit();
        console.log('🛑 Validator shutdown complete');
    }


}
