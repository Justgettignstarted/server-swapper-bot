
import { sendBotCommand } from '@/utils/discord';
import { toast } from 'sonner';

export const useBotCommands = (token: string | null) => {
  const executeCommand = async (command: string, params?: Record<string, any>) => {
    if (!token) {
      toast.error('Please enter a bot token first');
      throw new Error('No bot token provided');
    }
    
    try {
      return await sendBotCommand(token, command, params);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Command error: ${errorMessage}`);
      throw error;
    }
  };

  return { executeCommand };
};
