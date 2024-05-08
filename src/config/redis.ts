import Redis from 'ioredis';
import { env } from '../utils/env';

const redisClient = new Redis(env.redis_url);

redisClient.on("connect", () => {
    console.log("Redis connected.");
});
redisClient.on("end", () => {
    console.log("Redis disconnected.");
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export default redisClient;
