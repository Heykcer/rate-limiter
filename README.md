# rate-limiter




api-gateway-rate-limiter/
├── src/
│   ├── config/             # App configs & rate-limit rules
│   │   ├── env.js
│   │   └── rules.js
│   ├── constants/          # Fixed HTTP status codes & messages
│   │   └── http.js
│   ├── middlewares/        # Express middleware handlers
│   │   ├── rateLimiter.js  # Main rate-limiting middleware
│   │   ├── proxy.js        # Reverse proxy request forwarder
│   │   └── errorHandler.js
│   ├── services/           # External service handlers
│   │   └── redis.js        # Redis client & connection management
│   ├── strategies/         # Core rate-limiting algorithm logic
│   │   ├── slidingWindow.js
│   │   ├── tokenBucket.js
│   │   └── lua/            # Optional atomic Lua scripts for Redis
│   │       └── sliding_window.lua
│   ├── utils/              # Utility functions
│   │   ├── keyExtractor.js # Extracts IP / API Key / JWT sub
│   │   └── logger.js
│   ├── app.js              # Express app setup & middleware pipeline
│   └── server.js           # Server entry point & graceful shutdown
├── tests/                  # Unit and integration tests
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
└── README.md

# Rate Limiter API Gateway: Production Roadmap

A step-by-step roadmap for building a high-performance, low-latency, and fault-tolerant distributed API Gateway rate limiter in JavaScript (Node.js & Express).

---

## Phase 1: Core Foundation & Low-Latency Architecture
> **Goal:** Set up a lightweight server instance with minimal memory footprint and fast request identification.

- [ ] **Project Setup & Dependencies**
  - Initialize project (`npm init -y`) and set up ES modules / CommonJS conventions.
  - Install core libraries: `express`, `ioredis`, and `dotenv`. Avoid heavy, unnecessary frameworks to keep baseline memory consumption low.
- [ ] **Request Identification Layer**
  - Build `utils/keyExtractor.js` to parse incoming request headers cleanly.
  - Prioritize unique identifiers: API Key (`x-api-key`), OAuth/JWT subject claims, or IP address (handling `X-Forwarded-For` proxy headers safely).
- [ ] **Configuration Engine**
  - Store tier-based rates (e.g., Free vs. Paid limits) in `config/rules.js` to avoid runtime memory re-allocations on every request.

---

## Phase 2: Distributed State & Algorithm Implementation
> **Goal:** Ensure accurate request counts across multiple gateway instances using an atomic in-memory datastore.

- [ ] **Redis Connection Management**
  - Configure `ioredis` in `services/redis.js` with persistent socket pooling and aggressive connection timeouts to keep latency negligible.
- [ ] **Atomic Algorithm Choice (Sliding Window Counter)**
  - Select **Sliding Window Counter** or **Token Bucket** to efficiently prevent boundary traffic spikes.
  - Write atomic **Lua scripts** (`strategies/lua/sliding_window.lua`) to execute counting and timestamp expiration in a single Redis evaluation step.
  - *Benefits:* Guarantees zero race conditions under high concurrency while requiring standard $O(1)$ memory per active client key.

---

## Phase 3: Express Gateway Middleware Integration
> **Goal:** Intercept traffic, evaluate quotas dynamically, and route validated requests.

- [ ] **Middleware Flow Construction**
  - Extract the client identifier key.
  - Call the atomic Lua script in Redis via the storage wrapper.
  - Compute key metrics: **Limit**, **Remaining Tokens/Requests**, and **Reset Time**.
- [ ] **Standardized Header Enforcement**
  - Attach standard HTTP response headers to every request:
    - `X-RateLimit-Limit`
    - `X-RateLimit-Remaining`
    - `X-RateLimit-Reset`
- [ ] **Throttling & Proxy Layer**
  - If limit is exceeded, short-circuit and instantly return `HTTP 429 Too Many Requests` with a `Retry-After` header.
  - If limit is within bounds, pass control via `next()` directly to the downstream reverse proxy layer (`http-proxy-middleware`).

---

## Phase 4: High Fault Tolerance & Exception Handling
> **Goal:** Ensure system resilience and guarantee high availability even during database or network outages.

- [ ] **Fail-Open Mechanics**
  - Wrap Redis storage calls in `try/catch` blocks.
  - If Redis times out, fails over, or disconnects, fall back to a **fail-open strategy**: log the error asynchronously and allow incoming traffic through to avoid bringing down downstream services.
- [ ] **Local In-Memory Cache Fallback (Circuit Breaker)**
  - Implement a lightweight, short-lived fallback mechanism (e.g., simple LRU cache or Map) to handle micro-spikes locally if the primary datastore becomes temporarily unreachable.
- [ ] **Centralized Error Handling**
  - Implement Express global error-handling middleware (`middlewares/errorHandler.js`) to capture unhandled exceptions without leaking stack traces or crashing the process.

---

## Phase 5: Testing, Benchmarking & Production Readiness
> **Goal:** Validate performance metrics under load and verify edge-case reliability.

- [ ] **Unit & Integration Testing**
  - Write tests for key extraction, algorithm boundary conditions, and mock Redis failure scenarios.
- [ ] **Load & Latency Benchmarking**
  - Conduct stress testing using tools like `autocannon` or `k6` to verify low-latency overhead ($< 2\text{ms}$) and low RAM consumption under high RPS.
- [ ] **Observability & Logging**
  - Add lightweight structured logging (e.g., `pino`) to track throttled clients, system health, and Redis connection drops.
