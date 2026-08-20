import hideIP from '../utils/hideIP.js';
import ip from 'ip';


const MAX_REQUESTS=5;
const MAX_TIME=10_000; // 10 seconds

const requestCounts = new Map();
const ipRateLimiter = ((req, res, next) => {
   const myIP = hideIP(ip.address());
    requestCounts.set(myIP, (requestCounts.get(myIP) || 0) + 1);
    console.log(`Request count for ${myIP}: ${requestCounts.get(myIP)}`);
    if (requestCounts.get(myIP) > MAX_REQUESTS) {
        console.log(`Too many requests from ${myIP}. Blocking for ${MAX_TIME / 1000} seconds.`);
        return res.status(429).json({error: 'Too many requests. Please try again later.'});
    }
    setTimeout(() => {
        requestCounts.set(myIP, requestCounts.get(myIP) - 1);
    }, MAX_TIME);
    next();
});
export default ipRateLimiter;