
import { DiscordGuild } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

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
