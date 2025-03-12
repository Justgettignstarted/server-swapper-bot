
import { getBotConnectionStatus, checkBotStatus, fetchGuilds, fetchChannels, fetchRoles, fetchMembers } from './api';

/**
 * Helper function for fetching authorized user count
 */
const fetchAuthCount = async (token: string): Promise<any> => {
  try {
    const guilds = await fetchGuilds(token);
    let totalMembers = 0;
    
    // For demo purposes, we're using a simpler approach
    // In a real app, you'd have a more accurate way to count authorized users
    return { success: true, count: guilds.length * 100 };
  } catch (error) {
    throw error;
  }
};

/**
 * Helper function for transferring users
 */
const transferUsers = async (token: string, guildId: string, amount: number): Promise<any> => {
  try {
    // In a real app, this would initiate a user transfer process
    // For now, we'll just return a success message
    return { 
      success: true, 
      message: `Started transfer of ${amount} users to server ${guildId}`,
      transferId: Math.random().toString(36).substring(2, 15)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Helper function for setting roles
 */
const setRole = async (token: string, roleId: string, serverId: string): Promise<any> => {
  try {
    // In a real app, this would set a role for users
    // For now, we'll just return a success message
    return { 
      success: true, 
      message: `Role ${roleId} set for server ${serverId}`
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Send a command to the Discord bot
 */
export const sendBotCommand = async (token: string, command: string, params: Record<string, any> = {}): Promise<any> => {
  try {
    // Get the current status
    const currentStatus = getBotConnectionStatus();
    if (currentStatus !== 'connected') {
      await checkBotStatus(token);
      // Check status again after the connection attempt
      if (getBotConnectionStatus() !== 'connected') {
        throw new Error('Bot is not connected');
      }
    }
    
    // Handle different commands
    switch (command) {
      case 'test':
        return { success: true, message: 'Bot is online and operational' };
      case 'authorized':
        return fetchAuthCount(token);
      case 'progress':
        return { success: true, transfers: 13, pendingUsers: 47 };
      case 'join':
        const { gid, amt } = params;
        if (!gid || !amt) throw new Error('Missing required parameters');
        return transferUsers(token, gid, amt);
      case 'refreshtokens':
        return { success: true, tokensRefreshed: 534, failed: 12 };
      case 'set':
        const { roleid, serverid } = params;
        if (!roleid || !serverid) throw new Error('Missing required parameters');
        return setRole(token, roleid, serverid);
      case 'getGuilds':
        return { success: true, guilds: await fetchGuilds(token) };
      case 'getChannels':
        if (!params.guildId) throw new Error('Guild ID is required');
        return { success: true, channels: await fetchChannels(token, params.guildId) };
      case 'getRoles':
        if (!params.guildId) throw new Error('Guild ID is required');
        return { success: true, roles: await fetchRoles(token, params.guildId) };
      case 'getMembers':
        if (!params.guildId) throw new Error('Guild ID is required');
        return { success: true, members: await fetchMembers(token, params.guildId, params.limit) };
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('Bot command error:', error);
    throw error;
  }
};
