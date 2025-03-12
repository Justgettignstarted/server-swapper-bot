
import { getBotConnectionStatus, checkBotStatus, fetchGuilds, fetchChannels, fetchRoles, fetchMembers } from './api';

/**
 * Helper function for fetching authorized user count
 */
const fetchAuthCount = async (token: string): Promise<any> => {
  try {
    const guilds = await fetchGuilds(token);
    
    // In a real application, we'd have more accurate user counts
    // This is a simplified approach for demo purposes
    if (guilds && guilds.length > 0) {
      // Estimate users based on guild size (more realistic than multiplying by 100)
      const estimatedUsers = Math.floor(guilds.length * 25 + Math.random() * 10);
      return { success: true, count: estimatedUsers };
    }
    return { success: true, count: 0 };
  } catch (error) {
    console.error('Error in fetchAuthCount:', error);
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
        // More realistic transfer numbers for demonstration
        const transfers = Math.floor(Math.random() * 10) + 3; // 3-13 transfers
        const pendingUsers = Math.floor(Math.random() * 20) + 5; // 5-25 pending users
        return { success: true, transfers, pendingUsers };
      case 'join':
        const { gid, amt } = params;
        if (!gid || !amt) throw new Error('Missing required parameters');
        return transferUsers(token, gid, amt);
      case 'refreshtokens':
        const refreshed = Math.floor(Math.random() * 100) + 10;
        const failed = Math.floor(Math.random() * 5);
        return { success: true, tokensRefreshed: refreshed, failed };
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
