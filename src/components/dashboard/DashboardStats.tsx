
import React from 'react';
import { StatisticsCard } from '@/components/StatisticsCard';
import { Users, Server, RotateCw, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DashboardStatsProps {
  stats: {
    authorizedUsers: string;
    servers: string;
    transfers: string;
    verificationRate: string;
  };
  loadingStats: boolean;
  onRefresh: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats, 
  loadingStats,
  onRefresh
}) => {
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
          onClick={onRefresh}
          disabled={loadingStats}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard 
          title="Authorized Users" 
          value={loadingStats ? '...' : stats.authorizedUsers} 
          icon={<Users className="h-6 w-6 text-primary" />} 
        />
        <StatisticsCard 
          title="Servers" 
          value={loadingStats ? '...' : stats.servers} 
          icon={<Server className="h-6 w-6 text-primary" />} 
        />
        <StatisticsCard 
          title="Transfers Completed" 
          value={loadingStats ? '...' : stats.transfers} 
          icon={<RotateCw className="h-6 w-6 text-primary" />} 
        />
        <StatisticsCard 
          title="Verification Rate" 
          value={loadingStats ? '...' : stats.verificationRate} 
          icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
        />
      </div>
    </motion.div>
  );
};
