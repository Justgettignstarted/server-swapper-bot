
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useBot } from '@/context/BotContext';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Server } from 'lucide-react';

export const ServerTransferSection = () => {
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
    
    const interval = setInterval(async () => {
      try {
        const statusResponse = await executeCommand('transferStatus', { transferId });
        if (statusResponse.progress) {
          setProgress(statusResponse.progress);
          setUsersTransferred(Math.floor((statusResponse.progress / 100) * totalUsers));
          
          if (statusResponse.progress >= 100) {
            toast.success(`Successfully transferred ${totalUsers} users to server ${serverId}`);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Failed to check transfer status:", error);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [transferId, totalUsers, serverId, progress, executeCommand]);

  const handleStartTransfer = async () => {
    if (!serverId) {
      toast.error("Please enter a server ID");
      return;
    }
    
    if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    
    if (!isConnected) {
      toast.error("Bot is not connected. Please try again later.");
      return;
    }
    
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

  const handleCancelTransfer = () => {
    // In a real app, this would call an API to cancel the transfer
    setIsProcessing(false);
    setTransferId(null);
    setProgress(0);
    setUsersTransferred(0);
    toast.info("Transfer cancelled");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle>Server Transfer</CardTitle>
          <CardDescription>
            Transfer authorized users to another Discord server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-id">Destination Server ID</Label>
            <Input
              id="server-id"
              placeholder="Enter server ID"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              className="bg-secondary/50 border-secondary"
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Number of Users to Transfer</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary/50 border-secondary"
              disabled={isProcessing}
              type="number"
              min="1"
            />
          </div>
          
          {isProcessing && (
            <div className="space-y-3 mt-4">
              {targetServer && (
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Target server: </span>
                  <Badge variant="outline">{targetServer.name}</Badge>
                </div>
              )}
              
              {transferId && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Transfer ID: {transferId}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Transfer Progress</span>
                </div>
                <span>{usersTransferred} / {totalUsers} users</span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex items-center gap-2 text-xs">
                <RefreshCw className={`h-3 w-3 ${progress < 100 ? 'animate-spin' : ''}`} />
                <span>
                  {progress < 100 
                    ? `Transferring users... (${progress}%)`
                    : 'Transfer complete!'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isProcessing ? (
            <Button 
              onClick={handleStartTransfer} 
              disabled={isProcessing || !isConnected} 
              className="w-full bg-discord-blurple hover:bg-discord-blurple/90 btn-shine"
            >
              Start Transfer
            </Button>
          ) : (
            <Button 
              onClick={handleCancelTransfer}
              variant="destructive"
              className="w-full"
              disabled={progress >= 100}
            >
              {progress >= 100 ? 'Transfer Complete' : 'Cancel Transfer'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
