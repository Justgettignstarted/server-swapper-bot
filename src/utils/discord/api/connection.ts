
import { BotConnectionStatus, BotStatus } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

// Bot connection status
let botConnectionStatus: BotConnectionStatus = 'disconnected';
let botConnectionError: string | null = null;

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
 * Get the current bot connection status
 */
export const getBotConnectionStatus = (): BotConnectionStatus => {
  return botConnectionStatus;
};
