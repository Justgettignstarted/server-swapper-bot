
export interface ParsedCommand {
  cmd: string;
  params: {
    guildId?: string;
    amount?: number;
    transferId?: string;
    roleId?: string;
    serverId?: string;
    limit?: number;
  };
}

/**
 * Parse a command string into a structured command object
 */
export const parseCommand = (commandString: string): ParsedCommand => {
  const parts = commandString.split(' ');
  const cmd = parts[0].replace('-', '');
  
  // Default parsed command with empty params
  const parsedCommand: ParsedCommand = {
    cmd,
    params: {}
  };
  
  // Parse parameters based on command type
  switch (cmd) {
    case 'getChannels':
    case 'getRoles':
      if (parts.length > 1) {
        parsedCommand.params.guildId = parts[1];
      }
      break;
      
    case 'getMembers':
      if (parts.length > 1) {
        parsedCommand.params.guildId = parts[1];
        if (parts.length > 2) {
          const limit = parseInt(parts[2]);
          if (!isNaN(limit)) {
            parsedCommand.params.limit = limit;
          }
        }
      }
      break;
      
    case 'join':
      if (parts.length >= 3) {
        parsedCommand.params.guildId = parts[1];
        parsedCommand.params.amount = parseInt(parts[2]);
      }
      break;
      
    case 'transferStatus':
      if (parts.length >= 2) {
        parsedCommand.params.transferId = parts[1];
      }
      break;
      
    case 'set':
      if (parts.length >= 3) {
        parsedCommand.params.roleId = parts[1];
        parsedCommand.params.serverId = parts[2];
      }
      break;
  }
  
  return parsedCommand;
};
