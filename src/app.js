import express from 'express';
import hideIP from './utils/hideIP.js';
import ipRateLimiter from './middlewares/rateLimiter.js';


const app=express();
import ip from 'ip';

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// const MAX_REQUESTS=5;
// const MAX_TIME=10_000; // 10 seconds
const myIP = hideIP(ip.address());


//Rate Limiter Middleware
app.use(ipRateLimiter);

console.log(myIP + ' is the server IP address');
app.get('/', (req, res) => {
    res.send('Welcome to the Rate Limiter API');
});


export default app;