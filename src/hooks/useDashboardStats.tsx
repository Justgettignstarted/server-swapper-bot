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
      const results = await Promise.allSettled([
        fetchServerCount(),
        fetchAuthorizedUsers(),
        fetchTransferStats()
      ]);
      
      // Extract values from Promise.allSettled results
      const [serverCountResult, authorizedUsersResult, transferStatsResult] = results;
      
      // Update with new values or keep existing ones on failure
      const newStats = { ...stats };
      
      if (serverCountResult.status === 'fulfilled') {
        newStats.servers = serverCountResult.value;
      }
      
      if (authorizedUsersResult.status === 'fulfilled') {
        newStats.authorizedUsers = authorizedUsersResult.value;
      }
      
      if (transferStatsResult.status === 'fulfilled') {
        newStats.transfers = transferStatsResult.value.transfers;
        newStats.verificationRate = transferStatsResult.value.verificationRate;
      }
      
      // Only update stats if we have valid values
      const hasValidValues = Object.values(newStats).every(val => 
        val !== '...' && val !== undefined && val !== null
      );
      
      if (hasValidValues) {
        setStats(newStats);
        console.log('Updated stats with valid values:', newStats);
      } else {
        console.warn('Skipped stats update due to invalid values:', newStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Only show error toast if enough time has passed since the last one
      const now = Date.now();
      if (now - lastErrorTime.current > ERROR_COOLDOWN) {
        lastErrorTime.current = now;
        toast.error('Failed to load dashboard statistics', { id: 'dashboard-stats-error' });
      }
    } finally {
      // Add a slight delay before turning off loading state to avoid flickering
      setTimeout(() => {
        setLoadingStats(false);
        fetchInProgress.current = false;
        lastRefreshTime.current = Date.now();
      }, 300);
    }
  }, [isConnected, fetchServerCount, fetchAuthorizedUsers, fetchTransferStats, stats]);

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
