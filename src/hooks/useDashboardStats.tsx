
import { useState, useEffect } from 'react';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  authorizedUsers: string;
  servers: string;
  transfers: string;
  verificationRate: string;
}

export const useDashboardStats = () => {
  const { status, isConnected, executeCommand, fetchGuilds } = useBot();
  const [stats, setStats] = useState<DashboardStats>({
    authorizedUsers: '0',
    servers: '0',
    transfers: '0',
    verificationRate: '0%'
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (isConnected) {
        setLoadingStats(true);
        try {
          // Get servers count directly from fetchGuilds
          try {
            const guilds = await fetchGuilds();
            const serverCount = guilds.length.toString();
            setStats(prev => ({ ...prev, servers: serverCount }));
          } catch (error) {
            console.error('Error fetching servers:', error);
            toast.error('Failed to fetch server count');
          }
          
          // Use commands for other stats with proper error handling
          try {
            const authResponse = await executeCommand('authorized');
            if (authResponse && authResponse.success) {
              setStats(prev => ({ ...prev, authorizedUsers: authResponse.count.toString() }));
            }
          } catch (error) {
            console.error('Error fetching authorized users:', error);
            toast.error('Failed to fetch user count');
          }
          
          try {
            // Get transfer data directly from Supabase
            const { data: transfers, error } = await supabase
              .from('transfers')
              .select('*');
              
            if (error) {
              throw error;
            }
            
            const completedTransfers = transfers.filter(t => t.status === 'completed').length;
            setStats(prev => ({ ...prev, transfers: completedTransfers.toString() }));
            
            // Calculate verification rate
            const totalUsers = transfers.reduce((sum, t) => sum + t.amount, 0);
            const processedUsers = transfers.reduce((sum, t) => sum + t.users_processed, 0);
            
            if (totalUsers > 0) {
              const rate = Math.round((processedUsers / totalUsers) * 100);
              setStats(prev => ({ ...prev, verificationRate: `${rate}%` }));
            }
          } catch (error) {
            console.error('Error fetching transfer progress:', error);
            toast.error('Failed to fetch transfer statistics');
            
            // Fallback to the command
            try {
              const progressResponse = await executeCommand('progress');
              if (progressResponse && progressResponse.success) {
                const transfers = progressResponse.transfers || 0;
                const pendingUsers = progressResponse.pendingUsers || 0;
                const total = transfers + pendingUsers;
                
                setStats(prev => ({ 
                  ...prev, 
                  transfers: transfers.toString(),
                  verificationRate: total > 0 ? 
                    `${Math.round((transfers / total) * 100)}%` : 
                    '0%'
                }));
              }
            } catch (error) {
              console.error('Error fetching transfer progress via command:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          toast.error('Failed to load dashboard statistics');
        } finally {
          setLoadingStats(false);
        }
      }
    };
    
    fetchStats();
    
    // Set up a refresh interval (every 30 seconds)
    const interval = setInterval(() => {
      if (isConnected) {
        fetchStats();
      }
    }, 30000);
    
    // Set up a subscription for real-time updates to transfers
    const channel = supabase
      .channel('transfers-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transfers'
        },
        () => {
          // When transfers change, refresh stats
          fetchStats();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [isConnected, executeCommand, fetchGuilds]);

  const refreshStats = async () => {
    toast.info("Refreshing dashboard statistics...");
    setLoadingStats(true);
    
    if (isConnected) {
      try {
        // Get servers count directly from fetchGuilds
        try {
          const guilds = await fetchGuilds();
          const serverCount = guilds.length.toString();
          setStats(prev => ({ ...prev, servers: serverCount }));
        } catch (error) {
          console.error('Error fetching servers:', error);
          toast.error('Failed to fetch server count');
        }
        
        // Use commands for other stats with proper error handling
        try {
          const authResponse = await executeCommand('authorized');
          if (authResponse && authResponse.success) {
            setStats(prev => ({ ...prev, authorizedUsers: authResponse.count.toString() }));
          }
        } catch (error) {
          console.error('Error fetching authorized users:', error);
          toast.error('Failed to fetch user count');
        }
        
        try {
          // Get transfer data directly from Supabase
          const { data: transfers, error } = await supabase
            .from('transfers')
            .select('*');
            
          if (error) {
            throw error;
          }
          
          const completedTransfers = transfers.filter(t => t.status === 'completed').length;
          setStats(prev => ({ ...prev, transfers: completedTransfers.toString() }));
          
          // Calculate verification rate
          const totalUsers = transfers.reduce((sum, t) => sum + t.amount, 0);
          const processedUsers = transfers.reduce((sum, t) => sum + t.users_processed, 0);
          
          if (totalUsers > 0) {
            const rate = Math.round((processedUsers / totalUsers) * 100);
            setStats(prev => ({ ...prev, verificationRate: `${rate}%` }));
          }
        } catch (error) {
          console.error('Error fetching transfer progress:', error);
          toast.error('Failed to fetch transfer statistics');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoadingStats(false);
      }
    } else {
      setLoadingStats(false);
      toast.error("Bot is not connected. Please connect first.");
    }
  };

  return { stats, loadingStats, refreshStats };
};
