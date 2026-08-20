import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const UPSTASH_API_KEY = process.env.UPSTASH_API_KEY || '';
export const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
export const REDIS_URL = process.env.REDIS_URL || '';
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || '';
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';