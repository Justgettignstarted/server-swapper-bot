
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transfer {
  id: string;
  guild_id: string;
  guild_name?: string;
  created_at: string;
  users_processed: number;
  amount: number;
  status: 'completed' | 'in-progress' | 'cancelled';
}

interface RecentTransfersProps {
  transfers: Transfer[];
}

export const RecentTransfers: React.FC<RecentTransfersProps> = ({ transfers }) => {
  if (transfers.length === 0) return null;
  
  return (
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
            {transfers.map(transfer => (
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
  );
};
