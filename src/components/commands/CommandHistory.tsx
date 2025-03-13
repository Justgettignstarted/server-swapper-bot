
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommandHistoryEntry } from '@/hooks/commands/useCommandHistory';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommandHistoryProps {
  history: CommandHistoryEntry[];
  onClearHistory: () => void;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ 
  history,
  onClearHistory
}) => {
  if (history.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Command History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No commands have been executed yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Command History</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearHistory}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-3">
            {history.map((entry) => (
              <li key={entry.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {entry.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                      {entry.command}
                    </code>
                  </div>
                  <Badge variant="outline">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </Badge>
                </div>
                <div className="mt-2 text-xs bg-accent/50 p-2 rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">
                    {typeof entry.result === 'object' 
                      ? JSON.stringify(entry.result, null, 2) 
                      : String(entry.result)}
                  </pre>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
