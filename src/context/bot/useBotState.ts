
import { useState, useEffect } from 'react';
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
    
    setConnecting(true);
    setStatus(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      console.log("Checking bot connection with token:", token ? `${token.substring(0, 10)}...` : 'none');
      const newStatus = await checkBotStatus(token);
      setStatus(newStatus);
      
      if (newStatus.status === 'connected') {
        toast.success('Bot is online and operational');
      } else if (newStatus.status === 'error') {
        toast.error(`Bot connection error: ${newStatus.error}`);
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
    }
  };

  // Set up automatic connection checking
  useEffect(() => {
    if (token) {
      checkConnection();
    }
    
    // Set up periodic checks if connected (every 5 minutes)
    let interval: NodeJS.Timeout | undefined;
    if (status.status === 'connected' && token) {
      interval = setInterval(checkConnection, 5 * 60 * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]);

  return {
    token,
    setToken,
    status,
    connecting,
    checkConnection
  };
};
