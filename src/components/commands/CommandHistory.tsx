
import React from 'react';
import { CommandHistoryEntry } from '@/hooks/commands/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommandHistoryProps {
  history: CommandHistoryEntry[];
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  onCommandClick: (command: string) => Promise<any>;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ 
  history, 
  onClearHistory,
  onToggleFavorite,
  onCommandClick
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Command History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {history.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 group"
            >
              <div className="flex-1 overflow-hidden">
                <div className="font-mono text-sm truncate">{entry.command}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={entry.success ? "default" : "destructive"}>
                  {entry.success ? "Success" : "Failed"}
                </Badge>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onCommandClick(entry.command)}
                    title="Run this command again"
                  >
                    <span className="sr-only">Run</span>
                    <span className="h-4 w-4">▶</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleFavorite(entry.id)}
                    title={entry.favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <span className="sr-only">{entry.favorite ? "Unfavorite" : "Favorite"}</span>
                    <Star className={`h-4 w-4 ${entry.favorite ? "text-yellow-400 fill-yellow-400" : ""}`} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onClearHistory} 
          className="w-full flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear History</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
