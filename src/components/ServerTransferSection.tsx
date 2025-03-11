
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useBot } from '@/context/BotContext';

export const ServerTransferSection = () => {
  const [serverId, setServerId] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usersTransferred, setUsersTransferred] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const { executeCommand, isConnected } = useBot();

  const handleStartTransfer = async () => {
    if (!serverId) {
      toast.error("Please enter a server ID");
      return;
    }
    
    if (!amount || isNaN(parseInt(amount))) {
      toast.error("Please enter a valid amount");
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
      
      toast.success(`Starting transfer to server ${serverId}`);
      
      // Simulate progress (in a real app, this would be updated via websockets or polling)
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          const newUsersTransferred = Math.floor((newProgress / 100) * parseInt(amount));
          setUsersTransferred(newUsersTransferred);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setProgress(100);
            setUsersTransferred(parseInt(amount));
            setIsProcessing(false);
            toast.success(`Successfully transferred ${amount} users to server ${serverId}`);
            return 100;
          }
          
          return newProgress;
        });
      }, 800);
    } catch (error) {
      toast.error("Failed to start transfer");
      setIsProcessing(false);
    }
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
            />
          </div>
          
          {isProcessing && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Transfer Progress</span>
                <span>{usersTransferred} / {totalUsers} users</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartTransfer} 
            disabled={isProcessing || !isConnected} 
            className="w-full bg-discord-blurple hover:bg-discord-blurple/90 btn-shine"
          >
            {isProcessing ? 'Transferring...' : 'Start Transfer'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
