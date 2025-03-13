
import React, { useState } from 'react';
import { CommandList } from '@/components/commands/CommandList';
import { RecentTransfers } from '@/components/commands/RecentTransfers';
import { CommandHistory } from '@/components/commands/CommandHistory';
import { FavoriteCommands } from '@/components/commands/FavoriteCommands';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/commands';
import { useCommandHistory } from '@/hooks/commands/useCommandHistory';
import { useRecentTransfers } from '@/hooks/useRecentTransfers';
import { toast } from 'sonner';

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();
  const { recentTransfers } = useRecentTransfers();
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { 
    commandHistory, 
    addCommandToHistory, 
    clearCommandHistory,
    toggleFavorite,
    addTagToCommand,
    removeTagFromCommand,
    getFavoriteCommands
  } = useCommandHistory();
  
  const favoriteCommands = getFavoriteCommands();

  // Updated executeCommand function that adds the result to command history
  const handleCommandExecution = async (command: string) => {
    if (isExecuting) {
      toast.info("Please wait, a command is already being executed...");
      return;
    }
    
    setIsExecuting(true);
    
    try {
      const result = await executeDiscordCommand(command);
      // Add the command and its result to history
      addCommandToHistory(command, true, result);
      toast.success("Command executed successfully");
      return result;
    } catch (error) {
      // Add failed command to history
      addCommandToHistory(command, false, error instanceof Error ? error.message : 'Command failed');
      toast.error(error instanceof Error ? error.message : 'Command execution failed');
      throw error;
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FavoriteCommands 
        favorites={favoriteCommands}
        onCommandClick={handleCommandExecution}
        onToggleFavorite={toggleFavorite}
        onAddTag={addTagToCommand}
        onRemoveTag={removeTagFromCommand}
      />
      
      <CommandList 
        commands={commands} 
        onCommandClick={handleCommandExecution}
      />
      
      <CommandHistory 
        history={commandHistory} 
        onClearHistory={clearCommandHistory}
        onToggleFavorite={toggleFavorite}
        onCommandClick={handleCommandExecution}
      />
      
      <RecentTransfers transfers={recentTransfers} />
    </div>
  );
};
