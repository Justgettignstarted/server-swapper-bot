import React, { useState, useEffect } from 'react';
import { CommandsPanel } from './CommandsPanel';
import { ServerTransferSection } from './ServerTransferSection';
import { StatisticsCard } from './StatisticsCard';
import { NavBar } from './NavBar';
import { BotSetup } from './BotSetup';
import { ServerInfoPanel } from './ServerInfoPanel';
import { DocumentationModal } from './DocumentationModal';
import { motion } from 'framer-motion';
import { Users, Server, RotateCw, ShieldCheck, HelpCircle } from 'lucide-react';
import { useBot } from '@/context/BotContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { status, checkConnection, connecting, isConnected, executeCommand } = useBot();
  const [stats, setStats] = useState({
    authorizedUsers: '0',
    servers: '0',
    transfers: '0',
    verificationRate: '0%'
  });
  const [isDocOpen, setIsDocOpen] = useState(false);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (isConnected) {
        try {
          const authResponse = await executeCommand('authorized');
          if (authResponse.success) {
            setStats(prev => ({ ...prev, authorizedUsers: authResponse.count.toString() }));
          }
          
          const guildsResponse = await executeCommand('getGuilds');
          if (guildsResponse.success) {
            setStats(prev => ({ ...prev, servers: guildsResponse.guilds.length.toString() }));
          }
          
          const progressResponse = await executeCommand('progress');
          if (progressResponse.success) {
            setStats(prev => ({ 
              ...prev, 
              transfers: progressResponse.transfers.toString(),
              verificationRate: `${Math.round((progressResponse.transfers / 
                (progressResponse.transfers + progressResponse.pendingUsers)) * 100)}%` 
            }));
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          toast.error('Failed to load dashboard statistics');
        }
      }
    };
    
    fetchStats();
  }, [isConnected, executeCommand]);
  
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDocOpen(true)}
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              Documentation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshConnection}
              disabled={connecting}
            >
              {connecting ? 'Checking...' : 'Refresh Connection'}
            </Button>
          </div>
        </div>
        
        {!isConnected && (
          <div className="mb-6">
            <BotSetup />
          </div>
        )}
        
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatisticsCard 
                title="Authorized Users" 
                value={stats.authorizedUsers} 
                icon={<Users className="h-6 w-6 text-primary" />} 
              />
              <StatisticsCard 
                title="Servers" 
                value={stats.servers} 
                icon={<Server className="h-6 w-6 text-primary" />} 
              />
              <StatisticsCard 
                title="Transfers Completed" 
                value={stats.transfers} 
                icon={<RotateCw className="h-6 w-6 text-primary" />} 
              />
              <StatisticsCard 
                title="Verification Rate" 
                value={stats.verificationRate} 
                icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
              />
            </div>
          </motion.div>
        )}
        
        {isConnected && (
          <Tabs defaultValue="commands" className="mb-8">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="server-info">Server Information</TabsTrigger>
              <TabsTrigger value="transfer">User Transfer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="commands">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-6 rounded-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Available Commands</h2>
                <CommandsPanel />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="server-info">
              <ServerInfoPanel />
            </TabsContent>
            
            <TabsContent value="transfer">
              <div className="max-w-md mx-auto">
                <ServerTransferSection />
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <DocumentationModal 
          open={isDocOpen} 
          onOpenChange={setIsDocOpen} 
        />
      </div>
    </div>
  );
};
