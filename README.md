# rate-limiter

```text
api-gateway-rate-limiter/
├── src/
│   ├── config/             # App configs 
│   │   ├── env.js
│   │
│   ├── middlewares/        # Express middleware handlers
│   │   ├── rateLimiter.js  # Main rate-limiting middleware
│   |
│   │   
│   ├── strategies/         # Core rate-limiting algorithm logic
│   │   ├── slidingWindow.js
│   │   ├── tokenBucket.js
│   ├── utils/              # Utility functions
│   │   ├── keyExtractor.js # Extracts IP / API Key / JWT sub
│   │   
│   ├── app.js              # Express app setup & middleware pipeline
│   │   └── server.js       # Server entry point & graceful shutdown
├── .env.example
├── package.json
└── README.md
```

