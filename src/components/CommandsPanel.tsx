
import React from 'react';
import { CommandList } from '@/components/commands/CommandList';
import { RecentTransfers } from '@/components/commands/RecentTransfers';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/commands'; // Updated import path
import { useRecentTransfers } from '@/hooks/useRecentTransfers';

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();
  const { recentTransfers } = useRecentTransfers();

  return (
    <div className="space-y-6">
      <CommandList 
        commands={commands} 
        onCommandClick={executeDiscordCommand}
      />
      
      <RecentTransfers transfers={recentTransfers} />
    </div>
  );
};
