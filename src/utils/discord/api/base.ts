
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
  
  // Ensure proper headers are set for Discord API
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const requestOptions = {
    ...options,
    headers
  };
  
  // Add some logging to help with debugging
  console.log(`Making API request to: ${endpoint}`);
  
  try {
    // For demo/preview purposes, if the endpoint is from Discord API and we're using
    // a demo token, simulate a successful response to avoid actual API calls
    if (endpoint.includes('discord.com/api') && 
        headers.get('Authorization')?.includes('MTEwOTkzMj')) {
      
      console.log('Using demo mode for Discord API');
      
      // Return mock responses for different endpoints
      if (endpoint.includes('/users/@me')) {
        return new Response(JSON.stringify({
          id: '1234567890',
          username: 'Discord_Bot',
          discriminator: '0000',
          avatar: null,
          bot: true,
          flags: 0
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      
      // Default mock response
      return new Response(JSON.stringify({ success: true }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    const response = await fetch(endpoint, requestOptions);
    
    // Log the response status for debugging
    console.log(`Response from ${endpoint}: ${response.status}`);
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : 5;
      
      console.warn(`Rate limited by Discord API for ${waitSeconds}s on ${endpoint}`);
      
      // Store when this endpoint's rate limit will expire
      rateLimitedEndpoints[endpoint] = now + (waitSeconds * 1000);
      
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000 + 100));
      return rateLimitAwareFetch(endpoint, options);
    }
    
    // Check for common API errors
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (e) {
        // If we can't parse the response as JSON, just use the status text
      }
      
      console.error(`Discord API error (${response.status}):`, errorBody);
      
      // For debugging purposes, log the full request details
      console.error('Request details:', {
        endpoint,
        method: options.method || 'GET',
        headers: Object.fromEntries(headers.entries()),
        body: options.body ? 'Redacted for security' : undefined
      });
      
      // Throw a detailed error
      throw new Error(`Discord API error (${response.status}): ${errorBody?.message || response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      // If it's already our own error, just rethrow it
      if (error.message.includes('Discord API error')) {
        throw error;
      }
      
      // Otherwise, wrap it in a more descriptive error
      console.error(`Network error when calling ${endpoint}:`, error);
      throw new Error(`Discord API network error: ${error.message}`);
    }
    
    // For unknown error types
    throw new Error(`Unknown error when calling Discord API`);
  }
};

/**
 * Validate a Discord bot token format (basic validation only)
 */
export const validateTokenFormat = (token: string): boolean => {
  // Discord bot tokens typically follow a specific format: 
  // - Starts with letters/numbers
  // - Contains two dots separating the parts
  // - Contains only letters, numbers, dots, underscores, and dashes
  
  // Basic validation, not foolproof
  return /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token);
};
