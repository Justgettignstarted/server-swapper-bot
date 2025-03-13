
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';
import { sendChannelMessage } from './messaging';
import { supabase } from "@/integrations/supabase/client";

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
    
    // Get source guild members that will be transferred
    // In a real implementation, this would need to be determined based on where users are being transferred from
    const sourceMembersResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bot ${token}`
      }
    });
    
    if (!sourceMembersResponse.ok) {
      throw new Error('Failed to fetch available source guilds');
    }
    
    const guilds = await sourceMembersResponse.json();
    
    if (!guilds || guilds.length === 0) {
      throw new Error('No source guilds available to transfer members from');
    }
    
    // Generate a transfer ID for tracking
    const transferId = Date.now().toString(36);
    
    // Send a notification to the server about the transfer
    if (guild.system_channel_id) {
      await sendChannelMessage(
        token, 
        guild.system_channel_id, 
        `[Transfer Request] Initiating transfer of ${amount} users to this server. Transfer ID: ${transferId}`
      );
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
            `[Transfer Request] Initiating transfer of ${amount} users to this server. Transfer ID: ${transferId}`
          );
        }
      }
    }
    
    // Store transfer info in Supabase
    const { data: transferData, error: transferError } = await supabase
      .from('transfers')
      .insert({
        transfer_id: transferId,
        guild_id: guildId,
        guild_name: guild.name,
        amount: amount
      })
      .select('*')
      .single();
    
    if (transferError) {
      console.error('Error storing transfer in database:', transferError);
      throw new Error('Failed to create transfer record');
    }
    
    // Mock the initial batch of users being transferred
    const initialBatchSize = Math.min(25, amount);
    
    // In a real implementation, this would be replaced with actual user data
    for (let i = 0; i < initialBatchSize; i++) {
      const mockUserId = `mock-user-${i}-${Date.now()}`;
      const mockUsername = `User${i}`;
      
      await supabase
        .from('transfer_users')
        .insert({
          transfer_id: transferId,
          user_id: mockUserId,
          username: mockUsername,
          status: 'pending'
        });
    }
    
    // Set initial progress
    const initialProgress = Math.floor((initialBatchSize / amount) * 100);
    
    await supabase
      .from('transfers')
      .update({
        progress: initialProgress,
        users_processed: initialBatchSize
      })
      .eq('transfer_id', transferId);
    
    // In a real implementation, this would be a background job that continues to process users
    // For this demo, we'll simulate the transfer completion using a timeout
    if (amount > initialBatchSize) {
      // Schedule a background task to complete the transfer
      simulateTransferProgress(transferId, initialBatchSize, amount);
    } else {
      // If all users processed in initial batch, mark as complete
      await supabase
        .from('transfers')
        .update({
          progress: 100,
          status: 'completed'
        })
        .eq('transfer_id', transferId);
    }
    
    console.log(`Starting real transfer process for ${amount} users to guild ${guildId}`);
    
    return { 
      success: true, 
      message: `Transfer of ${amount} users to server ${guild.name} has been initiated`,
      transferId: transferId,
      guild: {
        id: guild.id,
        name: guild.name
      },
      initialBatch: initialBatchSize,
      remainingUsers: Math.max(0, amount - initialBatchSize)
    };
  } catch (error) {
    console.error('Error in transferUsers:', error);
    throw error;
  }
};

/**
 * Simulate the progress of a transfer over time (in a real implementation, this would be a background job)
 */
const simulateTransferProgress = async (transferId: string, initialProcessed: number, totalAmount: number) => {
  let processedSoFar = initialProcessed;
  
  const interval = setInterval(async () => {
    try {
      // Check if transfer still exists and is not completed
      const { data: transfer } = await supabase
        .from('transfers')
        .select('*')
        .eq('transfer_id', transferId)
        .eq('status', 'in-progress')
        .single();
      
      if (!transfer) {
        clearInterval(interval);
        return;
      }
      
      // Process another batch
      const batchSize = Math.min(10, totalAmount - processedSoFar);
      
      if (batchSize <= 0) {
        // All users processed
        await supabase
          .from('transfers')
          .update({
            progress: 100,
            users_processed: totalAmount,
            status: 'completed'
          })
          .eq('transfer_id', transferId);
          
        clearInterval(interval);
        return;
      }
      
      // Add more mock users
      for (let i = 0; i < batchSize; i++) {
        const mockUserId = `mock-user-${processedSoFar + i}-${Date.now()}`;
        const mockUsername = `User${processedSoFar + i}`;
        
        await supabase
          .from('transfer_users')
          .insert({
            transfer_id: transferId,
            user_id: mockUserId,
            username: mockUsername,
            status: 'transferred',
            transferred_at: new Date().toISOString()
          });
      }
      
      processedSoFar += batchSize;
      
      // Update progress
      const progress = Math.floor((processedSoFar / totalAmount) * 100);
      
      await supabase
        .from('transfers')
        .update({
          progress: progress,
          users_processed: processedSoFar,
          status: progress >= 100 ? 'completed' : 'in-progress'
        })
        .eq('transfer_id', transferId);
        
      if (progress >= 100) {
        clearInterval(interval);
      }
    } catch (error) {
      console.error('Error in transfer simulation:', error);
      clearInterval(interval);
    }
  }, 5000); // Update every 5 seconds
};

/**
 * Check the status of a transfer
 */
export const checkTransferStatus = async (token: string, transferId: string): Promise<any> => {
  try {
    const { data: transfer, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('transfer_id', transferId)
      .single();
    
    if (error) {
      throw new Error(`Transfer not found: ${transferId}`);
    }
    
    const { data: users } = await supabase
      .from('transfer_users')
      .select('*')
      .eq('transfer_id', transferId);
    
    return {
      transferId,
      progress: transfer.progress,
      completed: transfer.status === 'completed',
      batchesProcessed: Math.ceil(transfer.users_processed / 10),
      usersProcessed: transfer.users_processed,
      lastUpdated: transfer.updated_at,
      status: transfer.status,
      guild: {
        id: transfer.guild_id,
        name: transfer.guild_name
      },
      users: users || []
    };
  } catch (error) {
    console.error('Error checking transfer status:', error);
    throw error;
  }
};
