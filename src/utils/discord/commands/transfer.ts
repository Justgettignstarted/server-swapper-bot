
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';
import { sendChannelMessage } from './messaging';

/**
 * Helper function for transferring users to a guild
 */
export const transferUsers = async (token: string, guildId: string, amount: number): Promise<any> => {
  try {
    // Verify the guild exists and the bot has access to it
    const guildResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bot ${token}`
      }
    });
    
    if (!guildResponse.ok) {
      throw new Error(`Invalid guild ID or bot doesn't have access: ${guildId}`);
    }
    
    const guild = await guildResponse.json();
    
    // In a real application, this would involve inviting users or setting up a system
    // for transferring users between servers. 
    // For now, we'll just send a notification to the system channel if available
    
    if (guild.system_channel_id) {
      await sendChannelMessage(
        token, 
        guild.system_channel_id, 
        `[Transfer Request] Received request to transfer ${amount} users to this server.`
      );
      
      return { 
        success: true, 
        message: `Notification sent to server ${guild.name} (${guildId})`,
        transferId: Date.now().toString(36)
      };
    } else {
      // Try to find any text channel if system channel isn't available
      const channelsResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/guilds/${guildId}/channels`, {
        method: 'GET',
        headers: {
          'Authorization': `Bot ${token}`
        }
      });
      
      if (channelsResponse.ok) {
        const channels = await channelsResponse.json();
        // Look for a text channel
        const textChannel = channels.find((channel: any) => channel.type === 0);
        
        if (textChannel) {
          await sendChannelMessage(
            token, 
            textChannel.id, 
            `[Transfer Request] Received request to transfer ${amount} users to this server.`
          );
          
          return { 
            success: true, 
            message: `Notification sent to channel ${textChannel.name} in server ${guild.name}`,
            transferId: Date.now().toString(36)
          };
        }
      }
      
      return { 
        success: true, 
        message: `Request processed but no suitable channel found to send notification in server ${guild.name}`,
        transferId: Date.now().toString(36)
      };
    }
  } catch (error) {
    console.error('Error in transferUsers:', error);
    throw error;
  }
};
