
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useStatsSubscription = (onDataChange: () => void) => {
  useEffect(() => {
    // Set up a subscription for real-time updates to transfers
    const channel = supabase
      .channel('transfers-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transfers'
        },
        () => {
          // When transfers change, refresh stats
          onDataChange();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);
};
