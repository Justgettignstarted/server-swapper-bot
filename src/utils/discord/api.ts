
import { 
  BotConnectionStatus, 
  BotStatus, 
  DiscordGuild, 
  DiscordChannel, 
  DiscordRole, 
  DiscordMember 
} from './types';

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10';

// Bot connection status
let botConnectionStatus: BotConnectionStatus = 'disconnected';
let botConnectionError: string | null = null;

// Rate limit handling
let rateLimitedEndpoints: Record<string, number> = {};

/**
 * Handles fetch requests with rate limit awareness
 */
const rateLimitAwareFetch = async (endpoint: string, options: RequestInit): Promise<Response> => {
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

/**
 * Check if the bot is online and operational
 */
export const checkBotStatus = async (token?: string): Promise<BotStatus> => {
  try {
    botConnectionStatus = 'connecting';
    
    // For security, we don't store the token in the frontend
    // Instead, we pass it to the function when needed
    if (!token) {
      throw new Error('Bot token is required');
    }
    
    // Test connection by fetching the bot's information
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Discord API: ${response.statusText}`);
    }
    
    botConnectionStatus = 'connected';
    botConnectionError = null;
    
    return {
      status: botConnectionStatus,
      error: null,
      lastChecked: new Date()
    };
  } catch (error) {
    botConnectionStatus = 'error';
    botConnectionError = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      status: botConnectionStatus,
      error: botConnectionError,
      lastChecked: new Date()
    };
  }
};

/**
 * Fetch guilds (servers) the bot is a member of
 */
export const fetchGuilds = async (token: string): Promise<DiscordGuild[]> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch guilds: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching guilds:', error);
    throw error;
  }
};

/**
 * Fetch channels in a specific guild
 */
export const fetchChannels = async (token: string, guildId: string): Promise<DiscordChannel[]> => {
  try {
    // First, try to fetch channels
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${guildId}/channels`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // If that fails, try fetching via other endpoint that might have different permission requirements
      const alternativeResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/channels`, {
        headers: {
          'Authorization': `Bot ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!alternativeResponse.ok) {
        throw new Error(`Failed to fetch channels: ${response.statusText}. Your bot may need additional permissions.`);
      }
      
      const allChannels = await alternativeResponse.json();
      // Filter only channels from the requested guild
      return allChannels.filter((channel: any) => channel.guild_id === guildId);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching channels:', error);
    // Return empty array instead of throwing to prevent UI breaking
    return [];
  }
};

/**
 * Fetch roles in a specific guild
 */
export const fetchRoles = async (token: string, guildId: string): Promise<DiscordRole[]> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${guildId}/roles`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch roles: ${response.statusText}. Your bot may need additional permissions.`);
      // Return empty array instead of throwing
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Fetch members in a specific guild
 */
export const fetchMembers = async (token: string, guildId: string, limit: number = 100): Promise<DiscordMember[]> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${guildId}/members?limit=${limit}`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch members: ${response.statusText}. Your bot may need privileged intents.`);
      // Return empty array instead of throwing
      return [];
    }
    
    const members = await response.json();
    return members.map((member: any) => ({
      id: member.user?.id || '',
      username: member.user?.username || 'Unknown User',
      avatar: member.user?.avatar,
      roles: member.roles || []
    }));
  } catch (error) {
    console.error('Error fetching members:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Get the current bot connection status
 */
export const getBotConnectionStatus = (): BotConnectionStatus => {
  return botConnectionStatus;
};
