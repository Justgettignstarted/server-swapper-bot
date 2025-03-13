
import { DiscordMember } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

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
