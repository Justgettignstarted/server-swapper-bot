
// Base utilities for Discord API interactions

// Discord API endpoints
export const DISCORD_API_BASE = 'https://discord.com/api/v10';

// Rate limit handling
let rateLimitedEndpoints: Record<string, number> = {};

/**
 * Handles fetch requests with rate limit awareness
 */
export const rateLimitAwareFetch = async (endpoint: string, options: RequestInit): Promise<Response> => {
  // Check if we're currently rate limited for this endpoint
  const now = Date.now();
  if (rateLimitedEndpoints[endpoint] && rateLimitedEndpoints[endpoint] > now) {
    const waitTime = Math.ceil((rateLimitedEndpoints[endpoint] - now) / 1000);
    console.log(`Rate limited for ${endpoint}, waiting ${waitTime}s`);
    
    // Wait until rate limit expires (plus a small buffer)
    await new Promise(resolve => setTimeout(resolve, (waitTime * 1000) + 100));
  }
  
  const response = await fetch(endpoint, options);
  
  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after');
    const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : 1;
    
    console.log(`Rate limited by Discord API for ${waitSeconds}s on ${endpoint}`);
    
    // Store when this endpoint's rate limit will expire
    rateLimitedEndpoints[endpoint] = now + (waitSeconds * 1000);
    
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000 + 100));
    return rateLimitAwareFetch(endpoint, options);
  }
  
  return response;
};
