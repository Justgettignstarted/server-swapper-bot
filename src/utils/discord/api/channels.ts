
import { DiscordChannel } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

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
