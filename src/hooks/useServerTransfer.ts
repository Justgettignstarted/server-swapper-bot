
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useBot } from '@/context/BotContext';
import { supabase } from "@/integrations/supabase/client";

export const useServerTransfer = () => {
  const [serverId, setServerId] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usersTransferred, setUsersTransferred] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [targetServer, setTargetServer] = useState<{id: string, name: string} | null>(null);
  
  const { executeCommand, isConnected } = useBot();

  // Check transfer status periodically if a transfer is active
  useEffect(() => {
    if (!transferId || progress >= 100) return;
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`transfer-${transferId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transfers',
          filter: `transfer_id=eq.${transferId}`
        },
        payload => {
          if (payload.new) {
            const transfer = payload.new as any;
            setProgress(transfer.progress);
            setUsersTransferred(transfer.users_processed);
            
            if (transfer.status === 'completed') {
              toast.success(`Successfully transferred ${transfer.amount} users to server ${transfer.guild_name}`);
            }
          }
        }
      )
      .subscribe();
    
    // As a backup, still poll for updates every 5 seconds in case realtime fails
    const interval = setInterval(async () => {
      try {
        const statusResponse = await executeCommand('transferStatus', { transferId });
        if (statusResponse.progress) {
          setProgress(statusResponse.progress);
          setUsersTransferred(statusResponse.usersProcessed);
          
          if (statusResponse.status === 'completed') {
            toast.success(`Successfully transferred ${totalUsers} users to server ${serverId}`);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Failed to check transfer status:", error);
      }
    }, 5000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [transferId, totalUsers, serverId, progress, executeCommand]);

  const handleStartTransfer = async () => {
    setIsProcessing(true);
    setProgress(0);
    setUsersTransferred(0);
    setTotalUsers(parseInt(amount));
    
    try {
      // Execute the join command via the bot
      const response = await executeCommand('join', { 
        gid: serverId, 
        amt: parseInt(amount) 
      });
      
      // Set transfer ID for status tracking
      setTransferId(response.transferId);
      
      // Set target server info if available
      if (response.guild) {
        setTargetServer(response.guild);
      }
      
      toast.success(`Starting transfer to server ${response.guild?.name || serverId}`);
      
      // Set initial progress based on the first batch
      const initialProgress = Math.floor((response.initialBatch / parseInt(amount)) * 100);
      setProgress(initialProgress);
      setUsersTransferred(response.initialBatch);
      
      // If all users were transferred in the initial batch, mark as complete
      if (response.remainingUsers === 0) {
        setTimeout(() => {
          setProgress(100);
          setUsersTransferred(parseInt(amount));
          setIsProcessing(false);
          toast.success(`Successfully transferred ${amount} users to server ${response.guild?.name || serverId}`);
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to start transfer: ${errorMessage}`);
      setIsProcessing(false);
      setTransferId(null);
    }
  };

  const handleCancelTransfer = async () => {
    if (transferId) {
      try {
        // Update the status in the database
        const { error } = await supabase
          .from('transfers')
          .update({ status: 'cancelled' })
          .eq('transfer_id', transferId);
          
        if (error) {
          throw error;
        }
        
        setIsProcessing(false);
        setTransferId(null);
        setProgress(0);
        setUsersTransferred(0);
        toast.info("Transfer cancelled");
      } catch (error) {
        console.error('Error cancelling transfer:', error);
        toast.error('Failed to cancel transfer');
      }
    } else {
      setIsProcessing(false);
      setProgress(0);
      setUsersTransferred(0);
      toast.info("Transfer cancelled");
    }
  };

  return {
    serverId,
    setServerId,
    amount,
    setAmount,
    isProcessing,
    progress,
    usersTransferred,
    totalUsers,
    transferId,
    targetServer,
    handleStartTransfer,
    handleCancelTransfer
  };
};
