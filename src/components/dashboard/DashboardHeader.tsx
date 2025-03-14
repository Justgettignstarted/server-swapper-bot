
import React from 'react';
import { useBot } from '@/context/BotContext';
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

  const handleRefreshConnection = () => {
    if (!connecting) {
      checkConnection();
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
