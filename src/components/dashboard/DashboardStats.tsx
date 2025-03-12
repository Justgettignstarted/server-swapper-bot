
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
