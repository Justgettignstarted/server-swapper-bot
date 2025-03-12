
import React, { useState } from 'react';
import { NavBar } from './NavBar';
import { BotSetup } from './BotSetup';
import { DocumentationModal } from './DocumentationModal';
import { motion } from 'framer-motion';
import { useBot } from '@/context/BotContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStats } from './dashboard/DashboardStats';
import { DashboardTabs } from './dashboard/DashboardTabs';

interface DashboardProps {
  onLogout: () => void;
  username?: string;
  isPremium?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, username, isPremium = false }) => {
  const { isConnected } = useBot();
  const { stats, loadingStats, refreshStats } = useDashboardStats();
  const [isDocOpen, setIsDocOpen] = useState(false);
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavBar isAuthorized={true} onLogout={onLogout} username={username} isPremium={isPremium} />
        
        <DashboardHeader 
          isDocOpen={isDocOpen} 
          setIsDocOpen={setIsDocOpen}
          loadingStats={loadingStats}
          handleRefreshStats={refreshStats}
        />
        
        {!isConnected && (
          <div className="mb-6">
            <BotSetup />
          </div>
        )}
        
        {isConnected && (
          <>
            <DashboardStats stats={stats} loadingStats={loadingStats} />
            <DashboardTabs />
          </>
        )}
        
        <DocumentationModal 
          open={isDocOpen} 
          onOpenChange={setIsDocOpen} 
        />
      </div>
    </div>
  );
};
