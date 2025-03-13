
// This file now serves as a compatibility layer for existing imports
// It re-exports all the functions from the new modular structure

import { 
  checkBotStatus,
  getBotConnectionStatus,
  fetchGuilds,
  fetchChannels,
  fetchRoles,
  fetchMembers,
  createWebhook,
  executeWebhook,
  getChannelWebhooks,
  deleteWebhook
} from './api/index';

// Re-export everything
export {
  checkBotStatus,
  getBotConnectionStatus,
  fetchGuilds,
  fetchChannels,
  fetchRoles,
  fetchMembers,
  createWebhook,
  executeWebhook,
  getChannelWebhooks,
  deleteWebhook
};
