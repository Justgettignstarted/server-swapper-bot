
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  isDocOpen: boolean;
  setIsDocOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingStats: boolean;
  handleRefreshStats: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isDocOpen,
  setIsDocOpen,
  loadingStats,
  handleRefreshStats
}) => {
  const { status, checkConnection, connecting, isConnected } = useBot();

  const handleRefreshConnection = () => {
    checkConnection();
    toast.info("Checking bot connection...");
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status.status === 'connected' ? 'bg-green-500' : 
          status.status === 'connecting' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`}></div>
        <span>
          Bot Status: {
            status.status === 'connected' ? 'Online' : 
            status.status === 'connecting' ? 'Connecting...' : 
            'Offline'
          }
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDocOpen(true)}
          className="flex items-center gap-1"
        >
          <HelpCircle className="h-4 w-4" />
          Documentation
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshConnection}
          disabled={connecting}
        >
          {connecting ? 'Checking...' : 'Refresh Connection'}
        </Button>
        {isConnected && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStats}
            disabled={loadingStats}
          >
            {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
          </Button>
        )}
      </div>
    </div>
  );
};
