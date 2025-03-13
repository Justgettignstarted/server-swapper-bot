
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
      return;
    }

    try {
      toast.loading(`Executing ${command}...`, { id: `cmd-${command.split(' ')[0].replace('-', '')}` });
      
      const { cmd, params } = parseCommand(command);
      
      switch (cmd) {
        case 'test':
          await handleTestCommand(executeCommand);
          break;
          
        case 'authorized':
          await handleAuthorizedCommand(executeCommand);
          break;
          
        case 'progress':
          await handleProgressCommand(executeCommand);
          break;
          
        case 'refreshtokens':
          await handleRefreshTokensCommand(executeCommand);
          break;
          
        case 'getGuilds':
          await handleGetGuildsCommand(executeCommand);
          break;
          
        case 'getChannels':
          await handleGetChannelsCommand(executeCommand, fetchGuilds, params.guildId);
          break;
          
        case 'getRoles':
          await handleGetRolesCommand(executeCommand, fetchGuilds, params.guildId);
          break;
          
        case 'getMembers':
          await handleGetMembersCommand(
            executeCommand, 
            fetchGuilds, 
            params.guildId, 
            params.limit
          );
          break;
          
        case 'join':
          if (params.guildId && params.amount !== undefined) {
            await handleJoinCommand(executeCommand, params.guildId, params.amount);
          } else {
            toast.error('Please provide both guild ID and amount: -join <guildId> <amount>', { id: `cmd-${cmd}` });
          }
          break;
          
        case 'transferStatus':
          if (params.transferId) {
            await handleTransferStatusCommand(executeCommand, params.transferId);
          } else {
            toast.error('Please provide transfer ID: -transferStatus <transferId>', { id: `cmd-${cmd}` });
          }
          break;
          
        case 'set':
          if (params.roleId && params.serverId) {
            await handleSetCommand(executeCommand, params.roleId, params.serverId);
          } else {
            toast.error('Please provide both role ID and server ID: -set <roleId> <serverId>', { id: `cmd-${cmd}` });
          }
          break;
          
        default:
          toast.info(`For ${command}, please provide the required parameters`, { id: `cmd-${cmd}` });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Command execution failed: ${errorMessage}`);
    }
  };

  return { executeDiscordCommand };
};
