
import { toast } from 'sonner';
import { fetchGuilds, fetchChannels, fetchRoles, fetchMembers } from '@/utils/discord';

// The storage key for the bot token
export const BOT_TOKEN_STORAGE_KEY = 'discord_bot_token';

// Wrapper functions for fetching Discord data
export const fetchGuildsWrapper = async (token: string | null) => {
  if (!token) {
    toast.error('Please enter a bot token first');
    throw new Error('No bot token provided');
  }
  try {
    return await fetchGuilds(token);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to fetch guilds: ${errorMessage}`);
    throw error;
  }
};

export const fetchChannelsWrapper = async (token: string | null, guildId: string) => {
  if (!token) {
    toast.error('Please enter a bot token first');
    throw new Error('No bot token provided');
  }
  try {
    return await fetchChannels(token, guildId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to fetch channels: ${errorMessage}`);
    throw error;
  }
};

export const fetchRolesWrapper = async (token: string | null, guildId: string) => {
  if (!token) {
    toast.error('Please enter a bot token first');
    throw new Error('No bot token provided');
  }
  try {
    return await fetchRoles(token, guildId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to fetch roles: ${errorMessage}`);
    throw error;
  }
};

export const fetchMembersWrapper = async (token: string | null, guildId: string, limit?: number) => {
  if (!token) {
    toast.error('Please enter a bot token first');
    throw new Error('No bot token provided');
  }
  try {
    return await fetchMembers(token, guildId, limit);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to fetch members: ${errorMessage}`);
    throw error;
  }
};

// Function to simulate webhook registration
export const simulateWebhookRegistration = async (guildId: string, channelId: string) => {
  toast.loading('Registering webhook...', { id: 'webhook-registration' });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  toast.success('Webhook registered successfully', { id: 'webhook-registration' });
  
  return {
    success: true,
    webhookId: `webhook-${Math.random().toString(36).substring(2, 10)}`,
    webhookToken: `${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)}`
  };
};

// Function to clear bot cache
export const clearBotCache = () => {
  toast.info('Clearing bot cache...');
  // In a real implementation, this would make API calls to clear various caches
  // For now, we'll just simulate success
  setTimeout(() => {
    toast.success('Bot cache cleared successfully');
  }, 1000);
};
