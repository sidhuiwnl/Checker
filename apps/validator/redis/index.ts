import { createClient, type RedisClientType } from  "redis"

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error",(error) => {
    console.error("Redis client Error",error);
})

const response = await redisClient.connect();


export default redisClient;