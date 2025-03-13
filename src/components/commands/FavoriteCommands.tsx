
import React from 'react';
import { CommandHistoryEntry } from '@/hooks/commands/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Play } from 'lucide-react';

interface FavoriteCommandsProps {
  favorites: CommandHistoryEntry[];
  onCommandClick: (command: string) => Promise<any>;
  onToggleFavorite: (id: string) => void;
}

export const FavoriteCommands: React.FC<FavoriteCommandsProps> = ({ 
  favorites, 
  onCommandClick, 
  onToggleFavorite
}) => {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Favorite Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {favorites.map((favorite) => (
            <div 
              key={favorite.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 group"
            >
              <div className="flex-1 overflow-hidden">
                <div className="font-mono text-sm truncate">{favorite.command}</div>
              </div>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onCommandClick(favorite.command)}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggleFavorite(favorite.id)}
                >
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
