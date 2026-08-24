import hideIP from '../utils/hideIP.js';
import { TokenBucket } from '../strategies/tokenBucket.js';
import { SlidingWindow } from '../strategies/slidingWindow.js';


// Approach 1: Sliding Window (IP Counter)

const MAX_REQUESTS = 5;
const MAX_TIME_MS = 10_000; // 10 seconds

const swClients = new Map();

export const ipRateLimiter = ((req, res, next) => {
    // Get client IP address
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const myIP = hideIP(clientIP);
    
    if (!swClients.has(myIP)) {
        swClients.set(myIP, new SlidingWindow(MAX_REQUESTS, MAX_TIME_MS));
    }

    const window = swClients.get(myIP);
    console.log(`[SlidingWindow] Request count for ${myIP}: ${window.requests + 1}`);

    if (window.allowRequest()) {
        next();
    } else {
        console.log(`[SlidingWindow] Too many requests from ${myIP}. Blocking.`);
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
});



// Approach 2: Token Bucket

const BUCKET_CAPACITY = 5;
const REFILL_RATE_PER_SEC = 1; 

const tbClients = new Map();

export const tokenBucketRateLimiter = ((req, res, next) => {
    // Get client IP address
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const myIP = hideIP(clientIP);
    
    // Initialize bucket for new IPs
    if (!tbClients.has(myIP)) {
        tbClients.set(myIP, new TokenBucket(BUCKET_CAPACITY, REFILL_RATE_PER_SEC));
    }

    const bucket = tbClients.get(myIP);

    if (bucket.allowRequest()) {
        console.log(`[TokenBucket] Request processed successfully for ${myIP}. Tokens remaining: ${Math.floor(bucket.tokens)}`);
        next();
    } else {
        console.log(`[TokenBucket] 429 Too Many Requests from ${myIP}`);
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
});

// Default export (you can swap this to ipRateLimiter if you want the other behavior globally)
// export default tokenBucketRateLimiter;
export default ipRateLimiter;