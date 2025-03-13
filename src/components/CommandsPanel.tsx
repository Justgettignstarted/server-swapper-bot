
import React from 'react';
import { motion } from 'framer-motion';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/useCommandExecution';
import { CommandList } from '@/components/commands/CommandList';

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Available Commands</h2>
      <CommandList 
        commands={commands} 
        onCommandClick={executeDiscordCommand}
      />
    </motion.div>
  );
};
