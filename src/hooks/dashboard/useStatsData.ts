
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

// Track when the last error was shown for each error type to prevent spam
const errorNotificationTimestamps = {
  serverCount: 0,
  userCount: 0,
  transferStats: 0
};

// Minimum time between showing the same error notification (10 seconds)
const ERROR_NOTIFICATION_COOLDOWN = 10000;

export const useStatsData = () => {
  const { fetchGuilds, executeCommand } = useBot();

  const fetchServerCount = async (): Promise<string> => {
    try {
      const guilds = await fetchGuilds();
      return guilds.length.toString();
    } catch (error) {
      console.error('Error fetching servers:', error);
      
      // Check if we should show this error message based on cooldown
      const now = Date.now();
      if (now - errorNotificationTimestamps.serverCount > ERROR_NOTIFICATION_COOLDOWN) {
        errorNotificationTimestamps.serverCount = now;
        // Use a consistent toast ID to prevent duplicate notifications
        toast.error('Failed to fetch server count', { id: 'server-count-error' });
      }
      
      return '0';
    }
  };

  const fetchAuthorizedUsers = async (): Promise<string> => {
    try {
      const authResponse = await executeCommand('authorized');
      if (authResponse && authResponse.success) {
        return authResponse.count.toString();
      }
      return '0';
    } catch (error) {
      console.error('Error fetching authorized users:', error);
      
      // Check if we should show this error message based on cooldown
      const now = Date.now();
      if (now - errorNotificationTimestamps.userCount > ERROR_NOTIFICATION_COOLDOWN) {
        errorNotificationTimestamps.userCount = now;
        toast.error('Failed to fetch user count', { id: 'user-count-error' });
      }
      
      return '0';
    }
  };

  const fetchTransferStats = async (): Promise<{ transfers: string; verificationRate: string }> => {
    try {
      // Get transfer data directly from Supabase
      const { data: transfers, error } = await supabase
        .from('transfers')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Calculate completed transfers
      const completedTransfers = transfers.filter(t => t.status === 'completed').length;
      
      // Calculate verification rate - ensure reliable calculation
      let totalUsers = 0;
      let processedUsers = 0;
      
      if (transfers && transfers.length > 0) {
        totalUsers = transfers.reduce((sum, t) => {
          // Ensure we're working with numbers
          const amount = typeof t.amount === 'number' ? t.amount : 0;
          return sum + amount;
        }, 0);
        
        processedUsers = transfers.reduce((sum, t) => {
          // Ensure we're working with numbers
          const processed = typeof t.users_processed === 'number' ? t.users_processed : 0;
          return sum + processed;
        }, 0);
      }
      
      // Format verification rate
      let verificationRate = '0%';
      if (totalUsers > 0) {
        const rate = Math.round((processedUsers / totalUsers) * 100);
        verificationRate = `${rate}%`;
      }
      
      console.log('Transfer stats calculation:', { 
        completedTransfers, 
        totalUsers, 
        processedUsers, 
        verificationRate 
      });
      
      return { 
        transfers: completedTransfers.toString(), 
        verificationRate 
      };
    } catch (error) {
      console.error('Error fetching transfer stats from Supabase:', error);
      return await fetchTransferStatsFromCommand();
    }
  };

  const fetchTransferStatsFromCommand = async (): Promise<{ transfers: string; verificationRate: string }> => {
    try {
      const progressResponse = await executeCommand('progress');
      if (progressResponse && progressResponse.success) {
        const transfers = progressResponse.transfers || 0;
        const pendingUsers = progressResponse.pendingUsers || 0;
        const total = transfers + pendingUsers;
        
        const verificationRate = total > 0 ? 
          `${Math.round((transfers / total) * 100)}%` : 
          '0%';
        
        return { 
          transfers: transfers.toString(),
          verificationRate
        };
      }
      return { transfers: '0', verificationRate: '0%' };
    } catch (error) {
      console.error('Error fetching transfer progress via command:', error);
      
      // Check if we should show this error message based on cooldown
      const now = Date.now();
      if (now - errorNotificationTimestamps.transferStats > ERROR_NOTIFICATION_COOLDOWN) {
        errorNotificationTimestamps.transferStats = now;
        // Use consistent toast ID to prevent duplicates
        toast.error('Failed to fetch transfer stats', { id: 'transfer-stats-error' });
      }
      
      return { transfers: '0', verificationRate: '0%' };
    }
  };

  return {
    fetchServerCount,
    fetchAuthorizedUsers,
    fetchTransferStats
  };
};
