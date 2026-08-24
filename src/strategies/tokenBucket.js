export class TokenBucket {
    constructor(capacity, refillRatePerSec) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRatePerSec = refillRatePerSec;
        this.lastRefill = Date.now();
    }

    allowRequest() {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }

    refill() {
        const now = Date.now();
        const timePassedSec = (now - this.lastRefill) / 1000;
        const tokensToAdd = timePassedSec * this.refillRatePerSec;

        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
            this.lastRefill = now;
        }
    }
}
