
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, RefreshCw } from 'lucide-react';

interface HeaderActionsProps {
  onDocOpen: () => void;
  onRefreshConnection: () => void;
  onRefreshStats: () => void;
  connecting: boolean;
  loadingStats: boolean;
  isConnected: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onDocOpen,
  onRefreshConnection,
  onRefreshStats,
  connecting,
  loadingStats,
  isConnected
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDocOpen}
        className="flex items-center gap-1"
      >
        <HelpCircle className="h-4 w-4" />
        Documentation
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefreshConnection}
        disabled={connecting}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${connecting ? 'animate-spin' : ''}`} />
        {connecting ? 'Checking...' : 'Check Connection'}
      </Button>
      {isConnected && !connecting && (
        <Button 
          variant="default" 
          size="sm" 
          onClick={onRefreshStats}
          disabled={loadingStats}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
        </Button>
      )}
    </div>
  );
};
