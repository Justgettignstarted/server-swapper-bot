
import React, { useState, useMemo } from 'react';
import { CommandHistoryEntry } from '@/hooks/commands/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Play, X, Tags } from 'lucide-react';

interface FavoriteCommandsProps {
  favorites: CommandHistoryEntry[];
  onCommandClick: (command: string) => Promise<any>;
  onToggleFavorite: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
}

export const FavoriteCommands: React.FC<FavoriteCommandsProps> = ({ 
  favorites, 
  onCommandClick, 
  onToggleFavorite,
  onAddTag,
  onRemoveTag
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAddTag, setShowAddTag] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  // Extract all unique tags from favorites
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    favorites.forEach(fav => {
      if (fav.tags) {
        fav.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [favorites]);

  // Filter favorites based on active tag
  const filteredFavorites = useMemo(() => {
    if (!activeFilter) return favorites;
    return favorites.filter(fav => fav.tags?.includes(activeFilter));
  }, [favorites, activeFilter]);

  if (favorites.length === 0) {
    return null;
  }

  const handleAddTag = (id: string) => {
    if (newTag.trim() && onAddTag) {
      onAddTag(id, newTag.trim());
      setNewTag('');
      setShowAddTag(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Favorite Commands</span>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {activeFilter && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer" 
                  onClick={() => setActiveFilter(null)}
                >
                  Clear filter <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {allTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={activeFilter === tag ? "favorite" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredFavorites.map((favorite) => (
            <div 
              key={favorite.id} 
              className="flex flex-col border border-gray-100 rounded-md p-2 hover:bg-secondary/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                  <div className="font-mono text-sm truncate">{favorite.command}</div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onCommandClick(favorite.command)}
                    title="Execute command"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddTag(favorite.id === showAddTag ? null : favorite.id)}
                    title="Manage tags"
                  >
                    <Tags className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleFavorite(favorite.id)}
                    title="Remove from favorites"
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </Button>
                </div>
              </div>
              
              {favorite.tags && favorite.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {favorite.tags.map(tag => (
                    <Badge key={tag} variant="favorite" className="text-xs flex items-center">
                      {tag}
                      {onRemoveTag && (
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveTag(favorite.id, tag);
                          }} 
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              )}
              
              {showAddTag === favorite.id && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="border rounded px-2 py-1 text-xs flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(favorite.id)}
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleAddTag(favorite.id)}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
