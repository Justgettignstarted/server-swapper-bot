import React from 'react';
import { CommandCard } from './CommandCard';
import { motion } from 'framer-motion';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';

export const CommandsPanel = () => {
  const { executeCommand, isConnected, fetchGuilds } = useBot();
  
  const commands = [
    {
      command: "-test",
      description: "Check if bot is online",
      example: "-test"
    },
    {
      command: "-authorized",
      description: "Get the amount of users",
      example: "-authorized"
    },
    {
      command: "-progress",
      description: "See the progress so far",
      example: "-progress"
    },
    {
      command: "-join",
      description: "Join users to server",
      example: "-join <gid> <amt>"
    },
    {
      command: "-refreshtokens",
      description: "Refresh tokens",
      example: "-refreshtokens"
    },
    {
      command: "-set",
      description: "Sets the role once verified",
      example: "-set <roleid> <serverid>"
    },
    {
      command: "-getGuilds",
      description: "List all available servers",
      example: "-getGuilds"
    },
    {
      command: "-getChannels",
      description: "List all channels in a server",
      example: "-getChannels <guildId>"
    },
    {
      command: "-getRoles",
      description: "List all roles in a server",
      example: "-getRoles <guildId>"
    },
    {
      command: "-getMembers",
      description: "List members in a server",
      example: "-getMembers <guildId> <limit>"
    }
  ];

  const handleCommandClick = async (command: string) => {
    if (!isConnected) {
      toast.error("Bot is not connected. Please connect your bot token first.");
      return;
    }

    try {
      const parts = command.split(' ');
      const cmd = parts[0].replace('-', '');
      
      toast.loading(`Executing ${command}...`, { id: `cmd-${cmd}` });
      
      let response;
      switch (cmd) {
        case 'test':
          response = await executeCommand('test');
          toast.success(`Bot is online: ${response.message}`, { id: `cmd-${cmd}` });
          break;
          
        case 'authorized':
          response = await executeCommand('authorized');
          toast.success(`Current authorized users: ${response.count}`, { id: `cmd-${cmd}` });
          break;
          
        case 'progress':
          response = await executeCommand('progress');
          toast.success(`Transfers completed: ${response.transfers}, Pending users: ${response.pendingUsers}`, { id: `cmd-${cmd}` });
          break;
          
        case 'refreshtokens':
          response = await executeCommand('refreshtokens');
          toast.success(`Refreshed ${response.tokensRefreshed} tokens. Failed: ${response.failed}`, { id: `cmd-${cmd}` });
          break;
          
        case 'getGuilds':
          response = await executeCommand('getGuilds');
          toast.success(`Found ${response.guilds.length} servers`, { id: `cmd-${cmd}` });
          console.log('Available servers:', response.guilds);
          break;
          
        case 'getChannels':
          if (parts.length > 1) {
            const guildId = parts[1];
            response = await executeCommand('getChannels', { guildId });
            toast.success(`Found ${response.channels.length} channels in server ${guildId}`, { id: `cmd-${cmd}` });
            console.log('Channels:', response.channels);
          } else {
            const guilds = await fetchGuilds();
            if (guilds.length > 0) {
              response = await executeCommand('getChannels', { guildId: guilds[0].id });
              toast.success(`Found ${response.channels.length} channels in server ${guilds[0].name}`, { id: `cmd-${cmd}` });
              console.log('Channels:', response.channels);
            } else {
              toast.error('No servers available', { id: `cmd-${cmd}` });
            }
          }
          break;
          
        case 'getRoles':
          if (parts.length > 1) {
            const guildId = parts[1];
            response = await executeCommand('getRoles', { guildId });
            toast.success(`Found ${response.roles.length} roles in server ${guildId}`, { id: `cmd-${cmd}` });
            console.log('Roles:', response.roles);
          } else {
            const guildList = await fetchGuilds();
            if (guildList.length > 0) {
              response = await executeCommand('getRoles', { guildId: guildList[0].id });
              toast.success(`Found ${response.roles.length} roles in server ${guildList[0].name}`, { id: `cmd-${cmd}` });
              console.log('Roles:', response.roles);
            } else {
              toast.error('No servers available', { id: `cmd-${cmd}` });
            }
          }
          break;
          
        case 'getMembers':
          if (parts.length > 1) {
            const guildId = parts[1];
            const limit = parts.length > 2 ? parseInt(parts[2]) : 100;
            response = await executeCommand('getMembers', { guildId, limit });
            toast.success(`Found ${response.members.length} members in server ${guildId}`, { id: `cmd-${cmd}` });
            console.log('Members:', response.members);
          } else {
            const serverList = await fetchGuilds();
            if (serverList.length > 0) {
              response = await executeCommand('getMembers', { guildId: serverList[0].id, limit: 100 });
              toast.success(`Found ${response.members.length} members in server ${serverList[0].name}`, { id: `cmd-${cmd}` });
              console.log('Members:', response.members);
            } else {
              toast.error('No servers available', { id: `cmd-${cmd}` });
            }
          }
          break;
          
        case 'join':
          if (parts.length >= 3) {
            const guildId = parts[1];
            const amount = parseInt(parts[2]);
            
            if (isNaN(amount)) {
              toast.error('Invalid amount specified', { id: `cmd-${cmd}` });
              break;
            }
            
            response = await executeCommand('join', { gid: guildId, amt: amount });
            toast.success(response.message, { id: `cmd-${cmd}` });
          } else {
            toast.error('Please provide both guild ID and amount: -join <guildId> <amount>', { id: `cmd-${cmd}` });
          }
          break;
          
        case 'set':
          if (parts.length >= 3) {
            const roleId = parts[1];
            const serverId = parts[2];
            response = await executeCommand('set', { roleid: roleId, serverid: serverId });
            toast.success(response.message, { id: `cmd-${cmd}` });
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {commands.map((cmd, index) => (
        <motion.div key={index} variants={item} onClick={() => handleCommandClick(cmd.command)}>
          <CommandCard 
            command={cmd.command}
            description={cmd.description}
            example={cmd.example}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
