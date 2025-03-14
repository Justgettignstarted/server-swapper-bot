
import { useState, useEffect, useCallback, useRef } from 'react';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { useStatsData } from './dashboard/useStatsData';
import { useStatsSubscription } from './dashboard/useStatsSubscription';

interface DashboardStats {
  authorizedUsers: string;
  servers: string;
  transfers: string;
  verificationRate: string;
}

export const useDashboardStats = () => {
  const { status, isConnected } = useBot();
  const { fetchServerCount, fetchAuthorizedUsers, fetchTransferStats } = useStatsData();
  const fetchInProgress = useRef(false);
  const lastRefreshTime = useRef(0);
  const lastErrorTime = useRef(0);
  const ERROR_COOLDOWN = 10000; // 10 seconds between error messages
  const REFRESH_COOLDOWN = 3000; // 3 seconds between manual refresh attempts
  
  const [stats, setStats] = useState<DashboardStats>({
    authorizedUsers: '0',
    servers: '0',
    transfers: '0',
    verificationRate: '0%'
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current || !isConnected) return;
    
    fetchInProgress.current = true;
    setLoadingStats(true);
    
    try {
      // Fetch server count
      const serverCount = await fetchServerCount();
      setStats(prev => ({ ...prev, servers: serverCount }));
      
      // Fetch authorized users
      const authorizedUsers = await fetchAuthorizedUsers();
      setStats(prev => ({ ...prev, authorizedUsers }));
      
      // Fetch transfer stats
      const { transfers, verificationRate } = await fetchTransferStats();
      setStats(prev => ({ 
        ...prev, 
        transfers, 
        verificationRate 
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Only show error toast if enough time has passed since the last one
      const now = Date.now();
      if (now - lastErrorTime.current > ERROR_COOLDOWN) {
        lastErrorTime.current = now;
        toast.error('Failed to load dashboard statistics', { id: 'dashboard-stats-error' });
      }
    } finally {
      setLoadingStats(false);
      fetchInProgress.current = false;
      lastRefreshTime.current = Date.now();
    }
  }, [isConnected, fetchServerCount, fetchAuthorizedUsers, fetchTransferStats]);

  // Set up initial fetch and refresh interval
  useEffect(() => {
    if (isConnected) {
      fetchStats();
    }
    
    // Set up a refresh interval (every 30 seconds)
    const interval = setInterval(() => {
      if (isConnected && !fetchInProgress.current) {
        fetchStats();
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isConnected, fetchStats]);

  // Set up subscription to transfers table
  useStatsSubscription(fetchStats);

  const refreshStats = async () => {
    const now = Date.now();
    
    // Check if we're already fetching or if we've refreshed too recently
    if (fetchInProgress.current) {
      toast.info("Stats refresh already in progress", { id: 'refresh-stats-info' });
      return;
    }
    
    if (now - lastRefreshTime.current < REFRESH_COOLDOWN) {
      toast.info("Please wait before refreshing again", { id: 'refresh-cooldown' });
      return;
    }
    
    toast.info("Refreshing dashboard statistics...", { id: 'refresh-stats' });
    
    if (isConnected) {
      await fetchStats();
    } else {
      toast.error("Bot is not connected. Please connect first.", { id: 'refresh-stats-error' });
    }
  };

  return { stats, loadingStats, refreshStats };
};
