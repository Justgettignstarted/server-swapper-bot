
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { commands } from '@/data/commandsData';
import { useCommandExecution } from '@/hooks/useCommandExecution';
import { CommandList } from '@/components/commands/CommandList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const CommandsPanel = () => {
  const { executeDiscordCommand } = useCommandExecution();
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchRecentTransfers = async () => {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!error && data) {
        setRecentTransfers(data);
      }
    };
    
    fetchRecentTransfers();
    
    // Subscribe to changes
    const channel = supabase
      .channel('transfers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transfers'
        },
        () => {
          fetchRecentTransfers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <CommandList 
        commands={commands} 
        onCommandClick={executeDiscordCommand}
      />
      
      {recentTransfers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTransfers.map(transfer => (
                  <div key={transfer.id} className="p-2 bg-secondary/20 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{transfer.guild_name || transfer.guild_id}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(transfer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs">{transfer.users_processed}/{transfer.amount} users</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        transfer.status === 'completed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : transfer.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
