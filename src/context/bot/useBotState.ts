
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
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxCheckTime = useRef<NodeJS.Timeout | null>(null);

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
    
    // Clear any existing timeout to prevent overlapping checks
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
    
    // Clear any existing max check time timeout
    if (maxCheckTime.current) {
      clearTimeout(maxCheckTime.current);
      maxCheckTime.current = null;
    }
    
    checkInProgress.current = true;
    setConnecting(true);
    setStatus(prev => ({ ...prev, status: 'connecting' }));
    
    // Set a hard timeout to ensure we don't get stuck in connecting state
    maxCheckTime.current = setTimeout(() => {
      if (connecting && checkInProgress.current) {
        console.log("Force resetting connection check state after timeout");
        setConnecting(false);
        checkInProgress.current = false;
        setStatus(prev => ({
          ...prev,
          status: 'error',
          error: 'Connection check timed out',
          lastChecked: new Date()
        }));
        toast.error('Connection check timed out. Please try again.');
      }
    }, 10000); // 10 second absolute maximum
    
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
      // Clear the max check time timeout since we're done
      if (maxCheckTime.current) {
        clearTimeout(maxCheckTime.current);
        maxCheckTime.current = null;
      }
      
      // Add a small delay before allowing another check
      checkTimeoutRef.current = setTimeout(() => {
        setConnecting(false);
        checkInProgress.current = false;
        checkTimeoutRef.current = null;
      }, 1000); // 1 second cooldown (reduced from 2 seconds)
    }
  };

  // Initial connection check when token is available
  useEffect(() => {
    if (token && !initialCheckDone.current) {
      // Add a small delay to prevent immediate connection check on initial load
      const timer = setTimeout(() => {
        checkConnection();
      }, 300); // Reduced delay to 300ms from 500ms
      
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
      // Also clear any timeout on unmount
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (maxCheckTime.current) {
        clearTimeout(maxCheckTime.current);
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
