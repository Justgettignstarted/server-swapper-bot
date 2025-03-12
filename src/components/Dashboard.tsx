
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
import { PremiumSection } from './PremiumSection';

interface DashboardProps {
  onLogout: () => void;
  username?: string;
  isPremium?: boolean;
  onUpgrade?: (isPremium: boolean, tier: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onLogout, 
  username, 
  isPremium = false,
  onUpgrade
}) => {
  const { isConnected } = useBot();
  const { stats, loadingStats, refreshStats } = useDashboardStats();
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavBar 
          isAuthorized={true} 
          onLogout={onLogout} 
          username={username} 
          isPremium={isPremium} 
        />
        
        <div className="flex space-x-4 mb-6">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-discord-blurple text-white' : 'bg-discord-darker/20'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'premium' ? 'bg-discord-blurple text-white' : 'bg-discord-darker/20'}`}
            onClick={() => setActiveTab('premium')}
          >
            Premium Plans
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <>
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
          </>
        )}
        
        {activeTab === 'premium' && (
          <PremiumSection onUpgrade={onUpgrade} />
        )}
      </div>
    </div>
  );
};
