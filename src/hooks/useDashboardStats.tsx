
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
  const { status, isConnected, token } = useBot();
  const { fetchServerCount, fetchAuthorizedUsers, fetchTransferStats } = useStatsData();
  const fetchInProgress = useRef(false);
  const lastRefreshTime = useRef(0);
  const lastErrorTime = useRef(0);
  const ERROR_COOLDOWN = 10000; // 10 seconds between error messages
  const REFRESH_COOLDOWN = 3000; // 3 seconds between manual refresh attempts
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_LOADING_TIME = 15000; // 15 seconds maximum loading time
  
  const [stats, setStats] = useState<DashboardStats>({
    authorizedUsers: '0',
    servers: '0',
    transfers: '0',
    verificationRate: '0%'
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = useCallback(async () => {
    // Don't try to fetch if no token is available or fetch is already in progress
    if (fetchInProgress.current || !isConnected || !token) {
      console.log('Skipping stats fetch:', { 
        fetchInProgress: fetchInProgress.current, 
        isConnected, 
        tokenAvailable: !!token 
      });
      return;
    }
    
    fetchInProgress.current = true;
    setLoadingStats(true);
    
    // Set a maximum loading time
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      if (loadingStats && fetchInProgress.current) {
        // Force reset loading state if it's been too long
        fetchInProgress.current = false;
        setLoadingStats(false);
        toast.error("Stats loading timed out. Please try again.", { id: 'stats-timeout' });
      }
    }, MAX_LOADING_TIME);
    
    try {
      console.log('Fetching dashboard stats...');
      
      // Get data from real API endpoints concurrently
      const [serverCount, authorizedUsers, transferData] = await Promise.all([
        fetchServerCount().catch(err => {
          console.error('Error fetching server count:', err);
          return "0";
        }),
        fetchAuthorizedUsers().catch(err => {
          console.error('Error fetching authorized users:', err);
          return "0";
        }),
        fetchTransferStats().catch(err => {
          console.error('Error fetching transfer stats:', err);
          return { transfers: "0", verificationRate: "0%" };
        })
      ]);
      
      // Update stats with real data
      setStats({
        servers: serverCount || "0",
        authorizedUsers: authorizedUsers || "0",
        transfers: transferData?.transfers || "0",
        verificationRate: transferData?.verificationRate || "0%"
      });
      console.log('Stats updated successfully');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Only show error toast if enough time has passed since the last one
      const now = Date.now();
      if (now - lastErrorTime.current > ERROR_COOLDOWN) {
        lastErrorTime.current = now;
        toast.error('Failed to load dashboard statistics', { id: 'dashboard-stats-error' });
      }
    } finally {
      // Clear the loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Add a small delay before resetting loading state
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        fetchInProgress.current = false;
        lastRefreshTime.current = Date.now();
        setLoadingStats(false);
        refreshTimeoutRef.current = null;
      }, 1000); // Ensure loading state shows for at least 1 second
    }
  }, [isConnected, fetchServerCount, fetchAuthorizedUsers, fetchTransferStats, token]);

  // Set up initial fetch and refresh interval
  useEffect(() => {
    // Reset stats when connection status changes
    if (!isConnected) {
      setStats({
        authorizedUsers: '0',
        servers: '0',
        transfers: '0',
        verificationRate: '0%'
      });
    } else {
      // Only fetch if we're connected
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
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isConnected, fetchStats, token]);

  // Set up subscription to transfers table for real-time updates
  useStatsSubscription(fetchStats);

  const refreshStats = useCallback(async () => {
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
    
    if (!token) {
      toast.error("No bot token available. Please set up your bot first.", { id: 'refresh-stats-error' });
      return;
    }
    
    if (isConnected) {
      toast.info("Refreshing dashboard statistics...", { id: 'refresh-stats' });
      await fetchStats();
    } else {
      toast.error("Bot is not connected. Please connect first.", { id: 'refresh-stats-error' });
    }
  }, [isConnected, fetchStats, token]);

  return { stats, loadingStats, refreshStats };
};
