
import React from 'react';
import { CommandList } from '@/components/commands/CommandList';
import { RecentTransfers } from '@/components/commands/RecentTransfers';
import { CommandHistory } from '@/components/commands/CommandHistory';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/commands';
import { useCommandHistory } from '@/hooks/commands/useCommandHistory';
import { useRecentTransfers } from '@/hooks/useRecentTransfers';

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();
  const { recentTransfers } = useRecentTransfers();
  const { commandHistory, addCommandToHistory, clearCommandHistory } = useCommandHistory();

  // Updated executeCommand function that adds the result to command history
  const handleCommandExecution = async (command: string) => {
    try {
      const result = await executeDiscordCommand(command);
      // Add the command and its result to history
      addCommandToHistory(command, true, result);
      return result;
    } catch (error) {
      // Add failed command to history
      addCommandToHistory(command, false, error instanceof Error ? error.message : 'Command failed');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <CommandList 
        commands={commands} 
        onCommandClick={handleCommandExecution}
      />
      
      <CommandHistory 
        history={commandHistory} 
        onClearHistory={clearCommandHistory}
      />
      
      <RecentTransfers transfers={recentTransfers} />
    </div>
  );
};
