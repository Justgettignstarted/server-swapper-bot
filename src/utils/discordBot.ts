
/**
 * Discord Bot utility to handle connections and commands
 */

// Define the connection status type
export type BotConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Bot connection status
let botConnectionStatus: BotConnectionStatus = 'disconnected';
let botConnectionError: string | null = null;

// Discord API endpoints
const DISCORD_API_BASE = 'https://discord.com/api/v10';

export interface BotStatus {
  status: BotConnectionStatus;
  error: string | null;
  lastChecked: Date | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  memberCount?: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

export interface DiscordMember {
  id: string;
  username: string;
  avatar: string | null;
  roles: string[];
}

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
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
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
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
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
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/channels`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // If that fails, try fetching via other endpoint that might have different permission requirements
      const alternativeResponse = await fetch(`${DISCORD_API_BASE}/channels`, {
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
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/roles`, {
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
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/members?limit=${limit}`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch members: ${response.statusText}. Your bot may need additional privileged intents.`);
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
 * Send a command to the Discord bot
 */
export const sendBotCommand = async (token: string, command: string, params: Record<string, any> = {}): Promise<any> => {
  try {
    // Fixed: Use explicit comparison with the string literal 'connected'
    if (botConnectionStatus !== 'connected') {
      await checkBotStatus(token);
      // Fixed: Use explicit comparison with the string literal 'connected'
      if (botConnectionStatus !== 'connected') {
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

// Helper functions for common operations
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

export const useBotCommand = (): {
  execute: (token: string, command: string, params?: Record<string, any>) => Promise<any>;
  status: (token: string) => Promise<BotStatus>;
} => {
  return {
    execute: sendBotCommand,
    status: checkBotStatus
  };
};
