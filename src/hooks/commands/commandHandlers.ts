
import { toast } from 'sonner';
import { BotCommandResponse } from './types';

export const handleTestCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>
): Promise<BotCommandResponse> => {
  const response = await executeCommand('test');
  toast.success(`Bot is online: ${response.message}`, { id: 'cmd-test' });
  return response;
};

export const handleAuthorizedCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>
): Promise<BotCommandResponse> => {
  const response = await executeCommand('authorized');
  toast.success(`Current authorized users: ${response.count}`, { id: 'cmd-authorized' });
  return response;
};

export const handleProgressCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>
): Promise<BotCommandResponse> => {
  const response = await executeCommand('progress');
  toast.success(`Transfers completed: ${response.transfers}, Pending users: ${response.pendingUsers}`, { id: 'cmd-progress' });
  console.log('All transfers:', response.allTransfers);
  return response;
};

export const handleRefreshTokensCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>
): Promise<BotCommandResponse> => {
  const response = await executeCommand('refreshtokens');
  toast.success(`Refreshed ${response.tokensRefreshed} tokens. Failed: ${response.failed}`, { id: 'cmd-refreshtokens' });
  return response;
};

export const handleGetGuildsCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>
): Promise<BotCommandResponse> => {
  const response = await executeCommand('getGuilds');
  toast.success(`Found ${response.guilds.length} servers`, { id: 'cmd-getGuilds' });
  console.log('Available servers:', response.guilds);
  return response;
};

export const handleGetChannelsCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  fetchGuilds: () => Promise<any[]>,
  guildId?: string
): Promise<BotCommandResponse> => {
  let response;
  
  if (guildId) {
    response = await executeCommand('getChannels', { guildId });
    toast.success(`Found ${response.channels.length} channels in server ${guildId}`, { id: 'cmd-getChannels' });
  } else {
    const guilds = await fetchGuilds();
    if (guilds.length > 0) {
      response = await executeCommand('getChannels', { guildId: guilds[0].id });
      toast.success(`Found ${response.channels.length} channels in server ${guilds[0].name}`, { id: 'cmd-getChannels' });
    } else {
      toast.error('No servers available', { id: 'cmd-getChannels' });
      return { success: false, error: 'No servers available' };
    }
  }
  
  console.log('Channels:', response.channels);
  return response;
};

export const handleGetRolesCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  fetchGuilds: () => Promise<any[]>,
  guildId?: string
): Promise<BotCommandResponse> => {
  let response;
  
  if (guildId) {
    response = await executeCommand('getRoles', { guildId });
    toast.success(`Found ${response.roles.length} roles in server ${guildId}`, { id: 'cmd-getRoles' });
  } else {
    const guildList = await fetchGuilds();
    if (guildList.length > 0) {
      response = await executeCommand('getRoles', { guildId: guildList[0].id });
      toast.success(`Found ${response.roles.length} roles in server ${guildList[0].name}`, { id: 'cmd-getRoles' });
    } else {
      toast.error('No servers available', { id: 'cmd-getRoles' });
      return { success: false, error: 'No servers available' };
    }
  }
  
  console.log('Roles:', response.roles);
  return response;
};

export const handleGetMembersCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  fetchGuilds: () => Promise<any[]>,
  guildId?: string,
  limit: number = 100
): Promise<BotCommandResponse> => {
  let response;
  
  if (guildId) {
    response = await executeCommand('getMembers', { guildId, limit });
    toast.success(`Found ${response.members.length} members in server ${guildId}`, { id: 'cmd-getMembers' });
  } else {
    const serverList = await fetchGuilds();
    if (serverList.length > 0) {
      response = await executeCommand('getMembers', { guildId: serverList[0].id, limit });
      toast.success(`Found ${response.members.length} members in server ${serverList[0].name}`, { id: 'cmd-getMembers' });
    } else {
      toast.error('No servers available', { id: 'cmd-getMembers' });
      return { success: false, error: 'No servers available' };
    }
  }
  
  console.log('Members:', response.members);
  return response;
};

export const handleJoinCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  guildId: string,
  amount: number
): Promise<BotCommandResponse> => {
  if (isNaN(amount)) {
    toast.error('Invalid amount specified', { id: 'cmd-join' });
    return { success: false, error: 'Invalid amount specified' };
  }
  
  const response = await executeCommand('join', { gid: guildId, amt: amount });
  toast.success(`Transfer initiated: ${response.message}`, { id: 'cmd-join' });
  console.log('Transfer details:', response);
  return response;
};

export const handleTransferStatusCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  transferId: string
): Promise<BotCommandResponse> => {
  const response = await executeCommand('transferStatus', { transferId });
  toast.success(`Transfer progress: ${response.progress}%`, { id: 'cmd-transferStatus' });
  console.log('Transfer status:', response);
  return response;
};

export const handleSetCommand = async (
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>,
  roleId: string,
  serverId: string
): Promise<BotCommandResponse> => {
  const response = await executeCommand('set', { roleid: roleId, serverid: serverId });
  toast.success(response.message, { id: 'cmd-set' });
  return response;
};
