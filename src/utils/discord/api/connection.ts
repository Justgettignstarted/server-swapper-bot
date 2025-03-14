
// Connection status utilities for Discord bot

import { BotStatus } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch, validateTokenFormat } from './base';

// Track the current bot connection status
let botConnectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error' = 'disconnected';
let connectionError: string | null = null;
let lastChecked: Date | null = null;

/**
 * Get the current bot connection status
 */
export const getBotConnectionStatus = (): 'connected' | 'connecting' | 'disconnected' | 'error' => {
  return botConnectionStatus;
};

/**
 * Check if a Discord bot token is valid and the bot is online
 */
export const checkBotStatus = async (token: string): Promise<BotStatus> => {
  if (!token) {
    botConnectionStatus = 'error';
    connectionError = 'No token provided';
    lastChecked = new Date();
    
    return {
      status: 'error',
      error: 'No token provided',
      lastChecked: lastChecked
    };
  }
  
  // Do basic validation on token format
  if (!validateTokenFormat(token)) {
    botConnectionStatus = 'error';
    connectionError = 'Invalid token format';
    lastChecked = new Date();
    
    return {
      status: 'error',
      error: 'Invalid token format. Discord bot tokens should contain two periods.',
      lastChecked: lastChecked
    };
  }
  
  botConnectionStatus = 'connecting';
  console.log('Checking bot connection status...');
  
  try {
    // Set up a timeout to ensure the check doesn't hang indefinitely
    const timeoutPromise = new Promise<BotStatus>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Connection check timed out after 5 seconds'));
      }, 5000); // 5 second timeout
    });
    
    // The actual API check
    const checkPromise = rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bot ${token}`
      }
    }).then(async (response) => {
      // If we get a successful response, the bot is connected
      const botUser = await response.json();
      console.log('Bot is connected. Bot username:', botUser.username);
      
      botConnectionStatus = 'connected';
      connectionError = null;
      lastChecked = new Date();
      
      return {
        status: 'connected',
        error: null,
        lastChecked: lastChecked,
        botInfo: botUser
      } as BotStatus;
    });
    
    // Race the check against the timeout
    return await Promise.race([checkPromise, timeoutPromise]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking bot status:', errorMessage);
    
    botConnectionStatus = 'error';
    connectionError = errorMessage;
    lastChecked = new Date();
    
    return {
      status: 'error',
      error: errorMessage,
      lastChecked: lastChecked
    };
  }
};
