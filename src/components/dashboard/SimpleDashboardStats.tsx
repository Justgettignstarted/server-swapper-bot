
import React, { useState, useEffect } from 'react';
import { StatisticsCard } from '@/components/StatisticsCard';
import { Users, Server, RotateCw, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';

const DEFAULT_STATS = {
  authorizedUsers: '0',
  servers: '0',
  transfers: '0',
  verificationRate: '0%'
};

export const SimpleDashboardStats: React.FC = () => {
  const { isConnected } = useBot();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Function to fetch the statistics
  const fetchStats = async () => {
    if (!isConnected) {
      toast.error("Please connect your bot first");
      return;
    }

    setIsLoading(true);
    
    // Set a timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        toast.error("Stats loading timed out");
      }
    }, 10000);

    try {
      // Simulate stats fetching - in a real implementation, this would call your API
      // We'll use timeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app replace with actual API calls
      setStats({
        authorizedUsers: String(Math.floor(Math.random() * 100) + 10),
        servers: String(Math.floor(Math.random() * 20) + 1),
        transfers: String(Math.floor(Math.random() * 50) + 5),
        verificationRate: `${Math.floor(Math.random() * 100)}%`
      });
      
      toast.success("Statistics refreshed successfully");
    } catch (error) {
      toast.error("Failed to load statistics");
      console.error("Error fetching stats:", error);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
      setLastRefreshTime(Date.now());
    }
  };

  // Fetch stats on initial load if bot is connected
  useEffect(() => {
    if (isConnected) {
      fetchStats();
    }
  }, [isConnected]);

  const handleRefresh = () => {
    const now = Date.now();
    const COOLDOWN_TIME = 3000; // 3 seconds cooldown
    
    if (now - lastRefreshTime < COOLDOWN_TIME) {
      toast.info("Please wait a moment before refreshing again");
      return;
    }
    
    fetchStats();
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
          disabled={isLoading || !isConnected}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Stats'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard 
          title="Authorized Users" 
          value={stats.authorizedUsers} 
          icon={<Users className="h-6 w-6 text-primary" />} 
          loading={isLoading}
        />
        <StatisticsCard 
          title="Servers" 
          value={stats.servers} 
          icon={<Server className="h-6 w-6 text-primary" />} 
          loading={isLoading}
        />
        <StatisticsCard 
          title="Transfers Completed" 
          value={stats.transfers} 
          icon={<RotateCw className="h-6 w-6 text-primary" />} 
          loading={isLoading}
        />
        <StatisticsCard 
          title="Verification Rate" 
          value={stats.verificationRate} 
          icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
          loading={isLoading}
        />
      </div>
    </motion.div>
  );
};
