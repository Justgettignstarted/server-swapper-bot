
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommandsPanel } from '@/components/CommandsPanel';
import { ServerInfoPanel } from '@/components/ServerInfoPanel';
import { ServerTransferSection } from '@/components/ServerTransferSection';
import { PremiumSection } from '@/components/PremiumSection';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="commands" className="mb-8">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="commands">Commands</TabsTrigger>
        <TabsTrigger value="server-info">Server Information</TabsTrigger>
        <TabsTrigger value="transfer">User Transfer</TabsTrigger>
        <TabsTrigger value="premium" className="flex items-center gap-1">
          <Crown className="h-4 w-4 text-amber-500" />
          Premium
        </TabsTrigger>
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
      
      <TabsContent value="premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-6 rounded-lg"
        >
          <PremiumSection />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};
