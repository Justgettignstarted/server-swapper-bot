
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export const useStatsData = () => {
  const { fetchGuilds, executeCommand } = useBot();

  const fetchServerCount = async (): Promise<string> => {
    try {
      const guilds = await fetchGuilds();
      return guilds.length.toString();
    } catch (error) {
      console.error('Error fetching servers:', error);
      // Use a consistent toast ID to prevent duplicate notifications
      toast.error('Failed to fetch server count', { id: 'server-count-error' });
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
      toast.error('Failed to fetch user count', { id: 'user-count-error' });
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
      
      const completedTransfers = transfers.filter(t => t.status === 'completed').length;
      
      // Calculate verification rate
      const totalUsers = transfers.reduce((sum, t) => sum + t.amount, 0);
      const processedUsers = transfers.reduce((sum, t) => sum + t.users_processed, 0);
      
      let verificationRate = '0%';
      if (totalUsers > 0) {
        const rate = Math.round((processedUsers / totalUsers) * 100);
        verificationRate = `${rate}%`;
      }
      
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
      // Use consistent toast ID to prevent duplicates
      toast.error('Failed to fetch transfer stats', { id: 'transfer-stats-error' });
      return { transfers: '0', verificationRate: '0%' };
    }
  };

  return {
    fetchServerCount,
    fetchAuthorizedUsers,
    fetchTransferStats
  };
};
