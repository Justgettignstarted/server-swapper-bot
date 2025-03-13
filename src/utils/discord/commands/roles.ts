
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';

/**
 * Helper function for setting roles
 */
export const setRole = async (token: string, roleId: string, serverId: string): Promise<any> => {
  try {
    // First, validate that both the server and role exist
    const guildResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${serverId}`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!guildResponse.ok) {
      throw new Error(`Invalid server ID: ${serverId}`);
    }
    
    const rolesResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${serverId}/roles`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!rolesResponse.ok) {
      throw new Error(`Cannot access roles for server ${serverId}`);
    }
    
    const roles = await rolesResponse.json();
    const role = roles.find((r: any) => r.id === roleId);
    
    if (!role) {
      throw new Error(`Role ${roleId} not found in server ${serverId}`);
    }
    
    // In a real implementation, you would store this role association in a database
    // For now, we'll just return a success message
    return { 
      success: true, 
      message: `Role ${roleId} (${role.name}) set for server ${serverId}`
    };
  } catch (error) {
    console.error('Error in setRole:', error);
    throw error;
  }
};
