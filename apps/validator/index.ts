import {Validator} from "./controllers/validator-service.ts";

const validator = new Validator(process.env.REDIS_URL as string);

validator.start();

process.on('SIGINT', async () => {
    console.log('\n🔴 Shutting down gracefully...');
    await validator.shutdown();
    process.exit(0);
});

