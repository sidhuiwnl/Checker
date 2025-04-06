import {Validator} from "./controllers/validator-service.ts";


const redisUrl = process.env.REDIS_URL as string




const validator = new Validator(redisUrl);

validator.start();

process.on('SIGINT', async () => {
    console.log('\n🔴 Shutting down gracefully...');
    await validator.shutdown();
    process.exit(0);
});

