
import React from 'react';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { BotStatusIndicator } from './BotStatusIndicator';
import { HeaderActions } from './HeaderActions';

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
  const [lastRefreshTime, setLastRefreshTime] = React.useState(0);
  const REFRESH_COOLDOWN = 3000; // 3 seconds between refreshes
  
  const handleRefreshConnection = () => {
    // Prevent rapid refreshes
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      toast.info("Please wait before refreshing again");
      return;
    }
    
    // Only check connection if we're not already connecting
    if (!connecting) {
      setLastRefreshTime(now);
      checkConnection();
      toast.info("Checking bot connection...");
    } else {
      toast.info("Connection check already in progress...");
    }
  };

  const handleDocOpen = () => {
    setIsDocOpen(true);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <BotStatusIndicator status={status} />
      <HeaderActions 
        onDocOpen={handleDocOpen}
        onRefreshConnection={handleRefreshConnection}
        onRefreshStats={handleRefreshStats}
        connecting={connecting}
        loadingStats={loadingStats}
        isConnected={isConnected}
      />
    </div>
  );
};
