
import React from 'react';
import { CommandCard } from './CommandCard';
import { motion } from 'framer-motion';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';

export const CommandsPanel = () => {
  const { executeCommand, isConnected } = useBot();
  
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
      toast.error("Bot is not connected. Please try again later.");
      return;
    }

    try {
      const parts = command.replace('-', '').split(' ');
      const cmd = parts[0];
      
      toast.loading(`Executing ${command}...`);
      
      let response;
      switch (cmd) {
        case 'test':
          response = await executeCommand('test');
          toast.success(response.message);
          break;
        case 'authorized':
          response = await executeCommand('authorized');
          toast.success(`Current authorized users: ${response.count}`);
          break;
        case 'progress':
          response = await executeCommand('progress');
          toast.success(`Transfers completed: ${response.transfers}, Pending users: ${response.pendingUsers}`);
          break;
        case 'refreshtokens':
          response = await executeCommand('refreshtokens');
          toast.success(`Refreshed ${response.tokensRefreshed} tokens. Failed: ${response.failed}`);
          break;
        case 'getGuilds':
          response = await executeCommand('getGuilds');
          toast.success(`Found ${response.guilds.length} servers`);
          break;
        default:
          toast.info(`For ${command}, please provide the required parameters`);
      }
    } catch (error) {
      toast.error("Command execution failed");
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
