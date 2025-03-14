
import React from 'react';
import { StatisticsCard } from '@/components/StatisticsCard';
import { Users, Server, RotateCw, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export const SimpleDashboardStats: React.FC = () => {
  const { isConnected } = useBot();
  const { stats, loadingStats, refreshStats } = useDashboardStats();

  const handleRefresh = () => {
    if (!isConnected) {
      toast.error("Please connect your bot first");
      return;
    }
    
    refreshStats();
  };

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
          disabled={loadingStats || !isConnected}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          {loadingStats ? 'Refreshing...' : 'Refresh Stats'}
        </Button>
      </div>
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
