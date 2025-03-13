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

// Track active commands to prevent duplicates
const activeCommands = new Set<string>();
// Store last execution time to prevent rapid fires
const lastExecutionTimes = new Map<string, number>();
const EXECUTION_COOLDOWN = 2000; // 2 seconds cooldown between same command executions

export const useCommandExecution = () => {
  const { executeCommand, isConnected, fetchGuilds } = useBot();

  const executeDiscordCommand = async (command: string) => {
    if (!isConnected) {
      toast.error("Bot is not connected. Please connect your bot token first.");
      throw new Error("Bot is not connected");
    }

    // Parse the command first to get the base command
    const { cmd, params } = parseCommand(command);
    const commandId = `cmd-${cmd}-${JSON.stringify(params)}`;
    
    // Check for cooldown to prevent rapid fire of the same command
    const now = Date.now();
    const lastExecution = lastExecutionTimes.get(commandId) || 0;
    if (now - lastExecution < EXECUTION_COOLDOWN) {
      console.log(`Command ${cmd} executed too quickly, ignoring duplicate`);
      return;
    }
    
    // Prevent duplicate command execution
    if (activeCommands.has(commandId)) {
      console.log(`Command already in progress: ${cmd}`);
      return;
    }
    
    // Mark this command as active and update last execution time
    activeCommands.add(commandId);
    lastExecutionTimes.set(commandId, now);
    
    try {
      toast.loading(`Executing ${command}...`, { id: commandId });
      
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
            toast.error('Please provide both guild ID and amount: -join <guildId> <amount>', { id: commandId });
            throw new Error('Missing required parameters for join command');
          }
          break;
          
        case 'transferStatus':
          if (params.transferId) {
            result = await handleTransferStatusCommand(executeCommand, params.transferId);
          } else {
            toast.error('Please provide transfer ID: -transferStatus <transferId>', { id: commandId });
            throw new Error('Missing required parameters for transferStatus command');
          }
          break;
          
        case 'set':
          if (params.roleId && params.serverId) {
            result = await handleSetCommand(executeCommand, params.roleId, params.serverId);
          } else {
            toast.error('Please provide both role ID and server ID: -set <roleId> <serverId>', { id: commandId });
            throw new Error('Missing required parameters for set command');
          }
          break;
          
        default:
          toast.info(`For ${command}, please provide the required parameters`, { id: commandId });
          throw new Error(`Unknown command: ${cmd}`);
      }
      
      // Display success toast only once
      toast.success(`Command ${cmd} executed successfully`, { id: commandId });
      
      return result; // Return the command result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Command execution failed: ${errorMessage}`, { id: commandId });
      throw error; // Re-throw the error so the caller can handle it
    } finally {
      // Remove this command from active commands after completion
      setTimeout(() => {
        activeCommands.delete(commandId);
      }, 1000);
    }
  };

  return { executeDiscordCommand };
};
