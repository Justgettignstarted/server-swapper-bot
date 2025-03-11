
import React from 'react';
import { CommandsPanel } from './CommandsPanel';
import { ServerTransferSection } from './ServerTransferSection';
import { StatisticsCard } from './StatisticsCard';
import { NavBar } from './NavBar';
import { motion } from 'framer-motion';
import { Users, Server, RotateCw, ShieldCheck } from 'lucide-react';
import { useBot } from '@/context/BotContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { status, checkConnection, connecting } = useBot();
  
  const handleRefreshConnection = () => {
    checkConnection();
    toast.info("Checking bot connection...");
  };
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavBar isAuthorized={true} onLogout={onLogout} />
        
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshConnection}
            disabled={connecting}
          >
            {connecting ? 'Checking...' : 'Refresh Connection'}
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticsCard 
              title="Authorized Users" 
              value="783" 
              icon={<Users className="h-6 w-6 text-primary" />} 
            />
            <StatisticsCard 
              title="Servers" 
              value="5" 
              icon={<Server className="h-6 w-6 text-primary" />} 
            />
            <StatisticsCard 
              title="Transfers Completed" 
              value="13" 
              icon={<RotateCw className="h-6 w-6 text-primary" />} 
            />
            <StatisticsCard 
              title="Verification Rate" 
              value="98%" 
              icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
            />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-6">Available Commands</h2>
              <CommandsPanel />
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <ServerTransferSection />
          </div>
        </div>
      </div>
    </div>
  );
};
