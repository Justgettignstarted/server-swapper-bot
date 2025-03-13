
import { toast } from 'sonner';
import { useBot } from '@/context/BotContext';
import { parseCommand } from './commandParser';
import {
  handleTestCommand,
  handleAuthorizedCommand,
  handleProgressCommand,
  handleRefreshTokensCommand,
  handleGetGuildsCommand,
  handleGetChannelsCommand,
  handleGetRolesCommand,
  handleGetMembersCommand,
  handleJoinCommand,
  handleTransferStatusCommand,
  handleSetCommand
} from './commandHandlers';

export const useCommandExecution = () => {
  const { executeCommand, isConnected, fetchGuilds } = useBot();

  const executeDiscordCommand = async (command: string) => {
    if (!isConnected) {
      toast.error("Bot is not connected. Please connect your bot token first.");
      throw new Error("Bot is not connected");
    }

    try {
      toast.loading(`Executing ${command}...`, { id: `cmd-${command.split(' ')[0].replace('-', '')}` });
      
      const { cmd, params } = parseCommand(command);
      let result;
      
      switch (cmd) {
        case 'test':
          result = await handleTestCommand(executeCommand);
          break;
          
        case 'authorized':
          result = await handleAuthorizedCommand(executeCommand);
          break;
          
        case 'progress':
          result = await handleProgressCommand(executeCommand);
          break;
          
        case 'refreshtokens':
          result = await handleRefreshTokensCommand(executeCommand);
          break;
          
        case 'getGuilds':
          result = await handleGetGuildsCommand(executeCommand);
          break;
          
        case 'getChannels':
          result = await handleGetChannelsCommand(executeCommand, fetchGuilds, params.guildId);
          break;
          
        case 'getRoles':
          result = await handleGetRolesCommand(executeCommand, fetchGuilds, params.guildId);
          break;
          
        case 'getMembers':
          result = await handleGetMembersCommand(
            executeCommand, 
            fetchGuilds, 
            params.guildId, 
            params.limit
          );
          break;
          
        case 'join':
          if (params.guildId && params.amount !== undefined) {
            result = await handleJoinCommand(executeCommand, params.guildId, params.amount);
          } else {
            toast.error('Please provide both guild ID and amount: -join <guildId> <amount>', { id: `cmd-${cmd}` });
            throw new Error('Missing required parameters for join command');
          }
          break;
          
        case 'transferStatus':
          if (params.transferId) {
            result = await handleTransferStatusCommand(executeCommand, params.transferId);
          } else {
            toast.error('Please provide transfer ID: -transferStatus <transferId>', { id: `cmd-${cmd}` });
            throw new Error('Missing required parameters for transferStatus command');
          }
          break;
          
        case 'set':
          if (params.roleId && params.serverId) {
            result = await handleSetCommand(executeCommand, params.roleId, params.serverId);
          } else {
            toast.error('Please provide both role ID and server ID: -set <roleId> <serverId>', { id: `cmd-${cmd}` });
            throw new Error('Missing required parameters for set command');
          }
          break;
          
        default:
          toast.info(`For ${command}, please provide the required parameters`, { id: `cmd-${cmd}` });
          throw new Error(`Unknown command: ${cmd}`);
      }
      
      return result; // Return the command result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Command execution failed: ${errorMessage}`);
      throw error; // Re-throw the error so the caller can handle it
    }
  };

  return { executeDiscordCommand };
};
