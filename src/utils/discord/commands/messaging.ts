
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';
import { CommandResult } from '@/hooks/commands/types';

// Track recently sent messages to prevent spam
const recentMessages = new Map<string, number>();
const SPAM_PREVENTION_TIMEOUT = 5000; // 5 seconds between identical messages

/**
 * Helper function to send a message to a channel with spam prevention
 */
export const sendChannelMessage = async (token: string, channelId: string, content: string): Promise<CommandResult> => {
  // Create a key combining channel and message to prevent spam
  const messageKey = `${channelId}:${content}`;
  const now = Date.now();
  
  // Check if this exact message was sent recently to the same channel
  if (recentMessages.has(messageKey)) {
    const lastSent = recentMessages.get(messageKey) || 0;
    
    if (now - lastSent < SPAM_PREVENTION_TIMEOUT) {
      console.log(`Prevented spam message to channel ${channelId}: "${content}"`);
      return {
        success: false,
        error: 'Message rate limited to prevent spam',
        message: 'Please wait a moment before sending the same message again'
      };
    }
  }
  
  try {
    // Update the spam prevention map
    recentMessages.set(messageKey, now);
    
    // Clean up old entries every so often
    if (recentMessages.size > 100) {
      for (const [key, timestamp] of recentMessages.entries()) {
        if (now - timestamp > SPAM_PREVENTION_TIMEOUT) {
          recentMessages.delete(key);
        }
      }
    }
    
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error sending message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      message: 'Failed to send message'
    };
  }
};
