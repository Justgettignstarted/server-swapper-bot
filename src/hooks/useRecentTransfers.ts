
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Transfer {
  id: string;
  guild_id: string;
  guild_name?: string;
  created_at: string;
  users_processed: number;
  amount: number;
  status: 'completed' | 'in-progress' | 'cancelled' | string; // Allow any string to accommodate all possible values from Supabase
  transfer_id?: string;
  updated_at?: string;
  progress?: number;
}

export const useRecentTransfers = () => {
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  
  const fetchRecentTransfers = async () => {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (!error && data) {
      // Type assertion to ensure data conforms to the Transfer interface
      setRecentTransfers(data as Transfer[]);
    }
  };
  
  useEffect(() => {
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

  return { recentTransfers };
};
