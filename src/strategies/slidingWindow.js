export class SlidingWindow {
    constructor(maxRequests, timeWindowMs) {
        this.maxRequests = maxRequests;
        this.timeWindowMs = timeWindowMs;
        this.requests = 0;
    }

    allowRequest() {
        this.requests += 1;
        
        if (this.requests > this.maxRequests) {
            return false;
        }

        setTimeout(() => {
            this.requests -= 1;
        }, this.timeWindowMs);

        return true;
    }
}
