
import { DISCORD_API_BASE, rateLimitAwareFetch } from './base';

/**
 * Create a webhook in a Discord channel
 */
export const createWebhook = async (
  token: string, 
  channelId: string, 
  name: string = "Server Swapper Integration"
): Promise<{ id: string; token: string; }> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/channels/${channelId}/webhooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        avatar: null // Could be set to a base64 encoded image
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create webhook: ${errorData.message || response.statusText}`);
    }
    
    const webhook = await response.json();
    return {
      id: webhook.id,
      token: webhook.token
    };
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
};

/**
 * Execute a webhook
 */
export const executeWebhook = async (
  webhookId: string,
  webhookToken: string,
  content: string,
  username?: string,
  avatarUrl?: string
): Promise<void> => {
  try {
    const response = await rateLimitAwareFetch(
      `${DISCORD_API_BASE}/webhooks/${webhookId}/${webhookToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          username,
          avatar_url: avatarUrl
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to execute webhook: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error executing webhook:', error);
    throw error;
  }
};

/**
 * Get all webhooks for a channel
 */
export const getChannelWebhooks = async (
  token: string,
  channelId: string
): Promise<any[]> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/channels/${channelId}/webhooks`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get webhooks: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting webhooks:', error);
    throw error;
  }
};

/**
 * Delete a webhook
 */
export const deleteWebhook = async (
  token: string,
  webhookId: string
): Promise<void> => {
  try {
    const response = await rateLimitAwareFetch(`${DISCORD_API_BASE}/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete webhook: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
  }
};
