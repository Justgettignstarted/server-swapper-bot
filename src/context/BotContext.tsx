
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkBotStatus, sendBotCommand, BotStatus, fetchGuilds, fetchChannels, fetchRoles, fetchMembers } from '@/utils/discordBot';
import { toast } from 'sonner';

interface BotContextType {
  status: BotStatus;
  isConnected: boolean;
  connecting: boolean;
  token: string | null;
  setToken: (token: string) => void;
  checkConnection: () => Promise<void>;
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>;
  fetchGuilds: () => Promise<any>;
  fetchChannels: (guildId: string) => Promise<any>;
  fetchRoles: (guildId: string) => Promise<any>;
  fetchMembers: (guildId: string, limit?: number) => Promise<any>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

// Use localStorage to persist the token (not recommended for production)
const storageKey = 'discord_bot_token';

export const BotProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(storageKey);
  });
  const [status, setStatus] = useState<BotStatus>({
    status: 'disconnected',
    error: null,
    lastChecked: null
  });
  const [connecting, setConnecting] = useState(false);

  const setToken = (newToken: string) => {
    localStorage.setItem(storageKey, newToken);
    setTokenState(newToken);
  };

  const checkConnection = async () => {
    if (!token) {
      toast.error('Please enter a bot token first');
      return;
    }
    
    setConnecting(true);
    try {
      const newStatus = await checkBotStatus(token);
      setStatus(newStatus);
      
      if (newStatus.status === 'connected') {
        toast.success('Bot is online and operational');
      } else if (newStatus.status === 'error') {
        toast.error(`Bot connection error: ${newStatus.error}`);
      }
    } catch (error) {
      toast.error('Failed to check bot status');
    } finally {
      setConnecting(false);
    }
  };

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

  // Wrapper functions for fetching Discord data
  const fetchGuildsWrapper = async () => {
    if (!token) {
      toast.error('Please enter a bot token first');
      throw new Error('No bot token provided');
    }
    try {
      return await fetchGuilds(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to fetch guilds: ${errorMessage}`);
      throw error;
    }
  };

  const fetchChannelsWrapper = async (guildId: string) => {
    if (!token) {
      toast.error('Please enter a bot token first');
      throw new Error('No bot token provided');
    }
    try {
      return await fetchChannels(token, guildId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to fetch channels: ${errorMessage}`);
      throw error;
    }
  };

  const fetchRolesWrapper = async (guildId: string) => {
    if (!token) {
      toast.error('Please enter a bot token first');
      throw new Error('No bot token provided');
    }
    try {
      return await fetchRoles(token, guildId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to fetch roles: ${errorMessage}`);
      throw error;
    }
  };

  const fetchMembersWrapper = async (guildId: string, limit?: number) => {
    if (!token) {
      toast.error('Please enter a bot token first');
      throw new Error('No bot token provided');
    }
    try {
      return await fetchMembers(token, guildId, limit);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to fetch members: ${errorMessage}`);
      throw error;
    }
  };

  // Check connection on initial load if token exists
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
  }, [token, status.status]);

  return (
    <BotContext.Provider
      value={{
        status,
        isConnected: status.status === 'connected',
        connecting,
        token,
        setToken,
        checkConnection,
        executeCommand,
        fetchGuilds: fetchGuildsWrapper,
        fetchChannels: fetchChannelsWrapper,
        fetchRoles: fetchRolesWrapper,
        fetchMembers: fetchMembersWrapper
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
};
