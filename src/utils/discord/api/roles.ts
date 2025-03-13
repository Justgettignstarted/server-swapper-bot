
import { DiscordRole } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

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
