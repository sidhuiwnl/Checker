import { createClient, type RedisClientType } from "redis";

class RedisClient {
    private static instance: RedisClientType;

    private constructor() {}

    static async getInstance(): Promise<RedisClientType> {
        if (!this.instance) {
            this.instance = createClient({
                url: process.env.REDIS_URL,
            });

            this.instance.on("error", (err: Error) => {
                console.error("Redis Error:", err);
            });

            await this.instance.connect();
        }
        return this.instance;
    }
}

export const getRedisClient = async () => {
    return RedisClient.getInstance();
};
