
import React from 'react';
import { motion } from 'framer-motion';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/useCommandExecution';
import { CommandList } from '@/components/commands/CommandList';

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();

  return (
    <CommandList 
      commands={commands} 
      onCommandClick={executeDiscordCommand}
    />
  );
};
