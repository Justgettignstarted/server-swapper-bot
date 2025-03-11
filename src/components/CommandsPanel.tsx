
import React from 'react';
import { CommandCard } from './CommandCard';
import { motion } from 'framer-motion';

export const CommandsPanel = () => {
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
    }
  ];

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
        <motion.div key={index} variants={item}>
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
