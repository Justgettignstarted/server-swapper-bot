
import { useState, useEffect } from 'react';
import { CommandHistoryEntry } from './types';

export const useCommandHistory = () => {
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([]);
  
  // Load command history from localStorage on initial render
  useEffect(() => {
    const storedHistory = localStorage.getItem('command-history');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Ensure timestamps are Date objects
        const historyWithDates = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setCommandHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to parse command history from localStorage:', error);
      }
    }
  }, []);
  
  // Save command history to localStorage whenever it changes
  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem('command-history', JSON.stringify(commandHistory));
    }
  }, [commandHistory]);
  
  const addCommandToHistory = (command: string, success: boolean, result: any) => {
    const newEntry: CommandHistoryEntry = {
      id: Date.now().toString(),
      command,
      timestamp: new Date(),
      success,
      result,
      favorite: false,
      tags: []
    };
    
    // Add to the beginning of the array (newest first)
    setCommandHistory(prev => {
      const updatedHistory = [newEntry, ...prev];
      // Limit to 20 entries to prevent localStorage from growing too large
      return updatedHistory.slice(0, 20);
    });
  };
  
  const clearCommandHistory = () => {
    setCommandHistory([]);
    localStorage.removeItem('command-history');
  };
  
  const toggleFavorite = (id: string) => {
    setCommandHistory(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, favorite: !entry.favorite } 
          : entry
      )
    );
  };
  
  const addTagToCommand = (id: string, tag: string) => {
    setCommandHistory(prev => 
      prev.map(entry => {
        if (entry.id === id) {
          const currentTags = entry.tags || [];
          // Only add the tag if it's not already there
          if (!currentTags.includes(tag)) {
            return { ...entry, tags: [...currentTags, tag] };
          }
        }
        return entry;
      })
    );
  };
  
  const removeTagFromCommand = (id: string, tag: string) => {
    setCommandHistory(prev => 
      prev.map(entry => {
        if (entry.id === id && entry.tags) {
          return { 
            ...entry, 
            tags: entry.tags.filter(t => t !== tag) 
          };
        }
        return entry;
      })
    );
  };
  
  const getFavoriteCommands = () => {
    return commandHistory.filter(entry => entry.favorite);
  };
  
  return {
    commandHistory,
    addCommandToHistory,
    clearCommandHistory,
    toggleFavorite,
    addTagToCommand,
    removeTagFromCommand,
    getFavoriteCommands
  };
};
