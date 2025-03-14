
import React from 'react';
import { StatisticsCard } from '@/components/StatisticsCard';
import { Users, Server, RotateCw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
  loadingStats
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Dashboard Statistics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard 
          title="Authorized Users" 
          value={loadingStats ? 'Loading...' : stats.authorizedUsers} 
          icon={<Users className={`h-6 w-6 text-primary ${loadingStats ? 'animate-pulse' : ''}`} />} 
        />
        <StatisticsCard 
          title="Servers" 
          value={loadingStats ? 'Loading...' : stats.servers} 
          icon={<Server className={`h-6 w-6 text-primary ${loadingStats ? 'animate-pulse' : ''}`} />} 
        />
        <StatisticsCard 
          title="Transfers Completed" 
          value={loadingStats ? 'Loading...' : stats.transfers} 
          icon={<RotateCw className={`h-6 w-6 text-primary ${loadingStats ? 'animate-pulse' : ''}`} />} 
        />
        <StatisticsCard 
          title="Verification Rate" 
          value={loadingStats ? 'Loading...' : stats.verificationRate} 
          icon={<ShieldCheck className={`h-6 w-6 text-primary ${loadingStats ? 'animate-pulse' : ''}`} />} 
        />
      </div>
    </motion.div>
  );
};
