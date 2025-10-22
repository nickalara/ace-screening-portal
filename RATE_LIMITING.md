# Rate Limiting Implementation

## Overview

Rate limiting has been implemented for the `/api/submit-application` endpoint to prevent abuse and DoS (Denial of Service) attacks. The implementation uses an in-memory sliding window algorithm that tracks requests per IP address.

## Configuration

### Default Settings
- **Max Requests**: 10 requests
- **Time Window**: 10 minutes (600,000 milliseconds)
- **Identifier**: Client IP address

### Environment Variables

You can customize the rate limiting behavior using environment variables:

```bash
# Maximum number of requests allowed within the time window
RATE_LIMIT_MAX_REQUESTS=10

# Time window in milliseconds (default: 600000 = 10 minutes)
RATE_LIMIT_WINDOW_MS=600000
```

## How It Works

1. **Request Identification**: Each request is identified by the client's IP address, extracted from various headers (x-forwarded-for, x-real-ip, cf-connecting-ip).

2. **Sliding Window**: The rate limiter maintains a sliding window counter for each IP address. Once the limit is reached, additional requests are rejected until the window expires.

3. **Automatic Cleanup**: Expired rate limit entries are automatically cleaned up every 5 minutes to prevent memory leaks.

## Response Headers

All responses (both successful and rate-limited) include the following headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed (10)
- `X-RateLimit-Remaining`: Number of requests remaining in current window
- `X-RateLimit-Reset`: ISO timestamp when the rate limit window resets
- `Retry-After`: (429 responses only) Number of seconds to wait before retrying

## Rate Limit Exceeded Response

When the rate limit is exceeded, the API returns:

**Status Code**: 429 Too Many Requests

**Response Body**:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "error": "RATE_LIMIT_EXCEEDED"
}
```

**Response Headers**:
```
Retry-After: 540
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-10-21T10:45:30.123Z
```

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run the test script:
   ```bash
   node test-rate-limit.js http://localhost:3000
   ```

   This will send 15 requests (exceeding the limit of 10) and verify that:
   - The first 10 requests succeed (status 200)
   - Requests 11-15 are rate limited (status 429)
   - Appropriate headers are returned

### Testing with cURL

You can also test manually with cURL:

```bash
# Send multiple requests in quick succession
for i in {1..15}; do
  echo "Request $i"
  curl -X POST http://localhost:3000/api/submit-application \
    -F "data={\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"555-0123\"}" \
    -F "resume=@test-resume.txt" \
    -i | grep -E "(HTTP|X-RateLimit|Retry-After)"
  echo ""
done
```

## Implementation Details

### Files Modified/Created

1. **`/lib/rate-limit.ts`** (NEW)
   - Core rate limiting logic
   - IP extraction utilities
   - Configuration management

2. **`/app/api/submit-application/route.ts`** (MODIFIED)
   - Added rate limiting check at the beginning of the POST handler
   - Returns 429 status with appropriate headers when limit exceeded
   - Includes rate limit headers in successful responses

3. **`/test-rate-limit.js`** (NEW)
   - Automated testing script
   - Validates rate limiting behavior

### Architecture

```
Request → getClientIp() → applyRateLimit() → Check limit
                                                ↓
                                          Rate limited?
                                    ↙               ↘
                                  Yes                No
                                   ↓                 ↓
                          Return 429          Process request
                                               Return 200
```

## Production Considerations

### Limitations of In-Memory Rate Limiting

The current implementation uses in-memory storage, which has the following limitations:

1. **Not shared across instances**: If running multiple server instances (e.g., load balanced), each instance maintains its own rate limit counters.

2. **Lost on restart**: Rate limit counters are reset when the server restarts.

### Recommended for Production

For production environments with multiple server instances, consider using:

- **Redis-based rate limiting**: Shared state across all instances
- **Upstash Rate Limit**: Serverless-friendly, edge-compatible
- **API Gateway rate limiting**: AWS API Gateway, Cloudflare, etc.

Example with Upstash:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 m"),
});
```

### Security Best Practices

1. **Monitor rate limit violations**: Log and alert on excessive rate limit hits
2. **Adjust limits as needed**: Monitor legitimate usage patterns and adjust limits accordingly
3. **Use multiple rate limit tiers**: Consider different limits for authenticated vs. anonymous users
4. **Implement CAPTCHA**: Add CAPTCHA challenges for suspicious activity
5. **DDoS protection**: Use CloudFlare or similar services for additional DDoS protection

## Troubleshooting

### Rate limit not working

1. Check that the API route is correctly importing the rate limiting module
2. Verify environment variables are properly set
3. Check server logs for any errors

### False positives (legitimate users getting rate limited)

1. Review the rate limit configuration - you may need to increase the limits
2. Check if multiple users are behind the same IP (corporate networks, VPNs)
3. Consider implementing user-based rate limiting for authenticated users

### Rate limits reset unexpectedly

1. This is expected behavior with in-memory storage on server restarts
2. For persistent rate limiting, migrate to Redis or another external storage solution

## Future Enhancements

Potential improvements for the rate limiting system:

1. **Tiered rate limiting**: Different limits for different user types
2. **Burst allowances**: Allow short bursts of traffic above the limit
3. **Distributed rate limiting**: Redis-based solution for multi-instance deployments
4. **Rate limit analytics**: Dashboard showing rate limit statistics
5. **Dynamic rate limiting**: Adjust limits based on system load
6. **Whitelist/Blacklist**: Allow bypassing or stricter limits for specific IPs
