import redis from 'ioredis';
import { REDIS_URL } from '../config/env.js';

const client = new redis(REDIS_URL);

export default client;