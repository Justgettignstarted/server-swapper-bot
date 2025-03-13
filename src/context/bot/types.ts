
import { BotStatus } from '@/utils/discord/types';

export interface BotContextType {
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
  handleWebhookRegistration: (guildId: string, channelId: string) => Promise<any>;
  clearBotCache: () => void;
}
