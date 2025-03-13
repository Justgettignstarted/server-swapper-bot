
// Connection status utilities for Discord bot

import { BotStatus } from '../types';
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

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
  
  botConnectionStatus = 'connecting';
  console.log('Checking bot connection status...');
  
  try {
    // Check if the bot can access its own information, which verifies the token is valid
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // If we get a successful response, the bot is connected
    if (response.ok) {
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
      };
    } else {
      // If response is not ok, try to get error details
      let errorMessage = `Status ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, just use the status text
      }
      
      console.error('Bot connection error:', errorMessage);
      
      botConnectionStatus = 'error';
      connectionError = errorMessage;
      lastChecked = new Date();
      
      return {
        status: 'error',
        error: errorMessage,
        lastChecked: lastChecked
      };
    }
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
