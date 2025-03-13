
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';

/**
 * Helper function to send a message to a channel
 */
export const sendChannelMessage = async (token: string, channelId: string, content: string): Promise<any> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
