
import { 
  BotConnectionStatus, 
  BotStatus, 
  DiscordGuild, 
  DiscordChannel, 
  DiscordRole,
  DiscordMember 
} from './types';

import {
  checkBotStatus,
  fetchGuilds,
  fetchChannels,
  fetchRoles,
  fetchMembers
} from './api';

import { sendBotCommand } from './commands';

// Re-export all the types and functions
export {
  // Types
  BotConnectionStatus,
  BotStatus,
  DiscordGuild,
  DiscordChannel,
  DiscordRole,
  DiscordMember,
  
  // API functions
  checkBotStatus,
  fetchGuilds,
  fetchChannels,
  fetchRoles,
  fetchMembers,
  
  // Command functions
  sendBotCommand
};

/**
 * Hook for using bot commands
 */
export const useBotCommand = (): {
  execute: (token: string, command: string, params?: Record<string, any>) => Promise<any>;
  status: (token: string) => Promise<BotStatus>;
} => {
  return {
    execute: sendBotCommand,
    status: checkBotStatus
  };
};
