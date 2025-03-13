
import { createContext, useContext, ReactNode } from 'react';
import { BotContextType } from './bot/types';
import { useBotState } from './bot/useBotState';
import { useBotCommands } from './bot/useBotCommands';
import { 
  fetchGuildsWrapper, 
  fetchChannelsWrapper, 
  fetchRolesWrapper, 
  fetchMembersWrapper,
  simulateWebhookRegistration,
  clearBotCache
} from './bot/utils';

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider = ({ children }: { children: ReactNode }) => {
  const { token, setToken, status, connecting, checkConnection } = useBotState();
  const { executeCommand } = useBotCommands(token);

  // Create the context value from all our hooks and utilities
  const contextValue: BotContextType = {
    status,
    isConnected: status.status === 'connected',
    connecting,
    token,
    setToken,
    checkConnection,
    executeCommand,
    fetchGuilds: () => fetchGuildsWrapper(token),
    fetchChannels: (guildId: string) => fetchChannelsWrapper(token, guildId),
    fetchRoles: (guildId: string) => fetchRolesWrapper(token, guildId),
    fetchMembers: (guildId: string, limit?: number) => fetchMembersWrapper(token, guildId, limit),
    handleWebhookRegistration: (guildId: string, channelId: string) => 
      simulateWebhookRegistration(guildId, channelId),
    clearBotCache
  };

  return (
    <BotContext.Provider value={contextValue}>
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
