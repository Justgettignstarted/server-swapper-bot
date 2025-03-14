
import React from 'react';
import { StatisticsCard } from '@/components/StatisticsCard';
import { Users, Server, RotateCw, ShieldCheck, RefreshCcw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export const SimpleDashboardStats: React.FC = () => {
  const { isConnected, token, status } = useBot();
  const { stats, loadingStats, refreshStats } = useDashboardStats();

  const handleRefresh = () => {
    if (!token) {
      toast.error("No bot token found. Please set up your bot first");
      return;
    }
    
    if (!isConnected) {
      toast.error("Please connect your bot first");
      return;
    }
    
    refreshStats();
  };
  
  const showConnectionWarning = !token || !isConnected || status.status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Dashboard Statistics</h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loadingStats || !isConnected || !token}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
        </Button>
      </div>
      
      {showConnectionWarning && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-500">
              {!token 
                ? "Bot token not found" 
                : status.status === 'error' 
                  ? "Bot connection error" 
                  : "Bot not connected"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {!token 
                ? "Please set up your bot token in the Bot Connection Setup section" 
                : status.status === 'error' 
                  ? status.error || "There was an error connecting to your bot" 
                  : "Connect your bot to see live statistics"}
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard 
          title="Authorized Users" 
          value={stats.authorizedUsers} 
          icon={<Users className="h-6 w-6 text-primary" />} 
          loading={loadingStats}
        />
        <StatisticsCard 
          title="Servers" 
          value={stats.servers} 
          icon={<Server className="h-6 w-6 text-primary" />} 
          loading={loadingStats}
        />
        <StatisticsCard 
          title="Transfers Completed" 
          value={stats.transfers} 
          icon={<RotateCw className="h-6 w-6 text-primary" />} 
          loading={loadingStats}
        />
        <StatisticsCard 
          title="Verification Rate" 
          value={stats.verificationRate} 
          icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
          loading={loadingStats}
        />
      </div>
    </motion.div>
  );
};
