const rateLimitMap = new Map();

// Periodic cleanup of expired entries every 5 minutes
if (typeof global !== 'undefined' && !global.rateLimitIntervalId) {
  global.rateLimitIntervalId = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  
  // Make sure it doesn't prevent the Node process from exiting
  if (global.rateLimitIntervalId.unref) {
    global.rateLimitIntervalId.unref();
  }
}

/**
 * Checks if the request is within the rate limit.
 * @param {string} ip - The client's IP address.
 * @param {number} limit - Maximum number of requests allowed in the window.
 * @param {number} windowMs - Time window in milliseconds.
 * @returns {object} Rate limit status.
 */
export function rateLimit(ip, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  const key = ip;
  
  let record = rateLimitMap.get(key);
  if (!record || now > record.resetTime) {
    record = {
      resetTime: now + windowMs,
      count: 0,
    };
  }
  
  record.count += 1;
  rateLimitMap.set(key, record);
  
  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
  };
}
