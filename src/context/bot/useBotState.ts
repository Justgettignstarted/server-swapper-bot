
import { useState, useEffect, useRef } from 'react';
import { BotStatus } from '@/utils/discord/types';
import { checkBotStatus } from '@/utils/discord';
import { toast } from 'sonner';
import { BOT_TOKEN_STORAGE_KEY } from './utils';

export const useBotState = () => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(BOT_TOKEN_STORAGE_KEY);
  });
  
  const [status, setStatus] = useState<BotStatus>({
    status: 'disconnected',
    error: null,
    lastChecked: null
  });
  
  const [connecting, setConnecting] = useState(false);
  const checkInProgress = useRef(false);
  const initialCheckDone = useRef(false);

  const setToken = (newToken: string) => {
    if (!newToken.trim()) {
      localStorage.removeItem(BOT_TOKEN_STORAGE_KEY);
      setTokenState(null);
      setStatus({
        status: 'disconnected',
        error: null,
        lastChecked: new Date()
      });
      return;
    }
    localStorage.setItem(BOT_TOKEN_STORAGE_KEY, newToken);
    setTokenState(newToken);
  };

  const checkConnection = async () => {
    if (!token) {
      toast.error('Please enter a bot token first');
      return;
    }
    
    // Prevent multiple simultaneous checks
    if (checkInProgress.current) {
      console.log("Connection check already in progress, skipping");
      return;
    }
    
    checkInProgress.current = true;
    setConnecting(true);
    setStatus(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      console.log("Checking bot connection with token:", token ? `${token.substring(0, 10)}...` : 'none');
      const newStatus = await checkBotStatus(token);
      setStatus(newStatus);
      
      if (newStatus.status === 'connected') {
        // Only show toast for manual checks or first successful connection
        if (!initialCheckDone.current) {
          toast.success('Bot is online and operational');
          initialCheckDone.current = true;
        }
      } else if (newStatus.status === 'error') {
        toast.error(`Bot connection error: ${newStatus.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Bot connection check failed:", errorMessage);
      setStatus({
        status: 'error',
        error: errorMessage,
        lastChecked: new Date()
      });
      toast.error(`Failed to check bot status: ${errorMessage}`);
    } finally {
      setConnecting(false);
      checkInProgress.current = false;
    }
  };

  // Initial connection check when token is available
  useEffect(() => {
    if (token && !initialCheckDone.current) {
      // Add a small delay to prevent immediate connection check on initial load
      const timer = setTimeout(() => {
        checkConnection();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [token]);
    
  // Set up periodic checks if connected
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (status.status === 'connected' && token) {
      console.log("Setting up periodic connection checks");
      interval = setInterval(() => {
        console.log("Running periodic connection check");
        // For periodic checks, we'll use a quieter version that doesn't show success toasts
        if (!checkInProgress.current) {
          checkConnection();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }
    
    return () => {
      if (interval) {
        console.log("Clearing periodic connection checks");
        clearInterval(interval);
      }
    };
  }, [token, status.status]);

  return {
    token,
    setToken,
    status,
    connecting,
    checkConnection
  };
};
