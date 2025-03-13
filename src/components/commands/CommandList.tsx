
import React from 'react';
import { motion } from 'framer-motion';
import { CommandData } from '@/data/commandsData';
import { CommandCard } from '@/components/CommandCard';
import { containerVariants, itemVariants } from '@/constants/animationVariants';

interface CommandListProps {
  commands: CommandData[];
  onCommandClick: (command: string) => void;
}

export const CommandList: React.FC<CommandListProps> = ({ 
  commands, 
  onCommandClick 
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {commands.map((cmd, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants} 
          onClick={() => onCommandClick(cmd.command)}
        >
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
