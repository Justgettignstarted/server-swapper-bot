
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch actual transfer statistics
 */
export const fetchTransferStats = async (token: string): Promise<any> => {
  try {
    // Get transfer statistics from Supabase
    const { data: transfers, error: transfersError } = await supabase
      .from('transfers')
      .select('*');
    
    if (transfersError) {
      console.error('Error fetching transfers:', transfersError);
      return { success: true, transfers: 0, pendingUsers: 0 };
    }
    
    // Count completed transfers
    const completedTransfers = transfers.filter(t => t.status === 'completed').length;
    
    // Count pending users from in-progress transfers
    const pendingUsers = transfers
      .filter(t => t.status === 'in-progress')
      .reduce((sum, t) => sum + (t.amount - t.users_processed), 0);
    
    return { 
      success: true, 
      transfers: completedTransfers, 
      pendingUsers: pendingUsers,
      allTransfers: transfers
    };
  } catch (error) {
    console.error('Error in fetchTransferStats:', error);
    return { success: true, transfers: 0, pendingUsers: 0 };
  }
};
