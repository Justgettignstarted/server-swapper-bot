
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkBotStatus, sendBotCommand, BotStatus } from '@/utils/discordBot';
import { toast } from 'sonner';

interface BotContextType {
  status: BotStatus;
  isConnected: boolean;
  connecting: boolean;
  checkConnection: () => Promise<void>;
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<BotStatus>({
    status: 'disconnected',
    error: null,
    lastChecked: null
  });
  const [connecting, setConnecting] = useState(false);

  const checkConnection = async () => {
    setConnecting(true);
    try {
      const newStatus = await checkBotStatus();
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
    try {
      return await sendBotCommand(command, params);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Command error: ${errorMessage}`);
      throw error;
    }
  };

  // Check connection on initial load
  useEffect(() => {
    checkConnection();
    
    // Set up periodic checks (every 5 minutes)
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BotContext.Provider
      value={{
        status,
        isConnected: status.status === 'connected',
        connecting,
        checkConnection,
        executeCommand
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
