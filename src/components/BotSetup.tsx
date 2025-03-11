
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBot } from '@/context/BotContext';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const BotSetup = () => {
  const { token, setToken, status, checkConnection, connecting } = useBot();
  const [tokenInput, setTokenInput] = useState(token || '');
  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const handleSaveToken = () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter a valid bot token');
      return;
    }
    
    setToken(tokenInput.trim());
    toast.success('Bot token saved');
    checkConnection();
  };
  
  const handleClearToken = () => {
    setToken('');
    setTokenInput('');
    toast.info('Bot token cleared');
  };
  
  const toggleTokenVisibility = () => {
    setIsTokenVisible(!isTokenVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.status === 'connected' ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : status.status === 'connecting' ? (
              <Shield className="h-5 w-5 text-yellow-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-red-500" />
            )}
            Bot Connection Setup
          </CardTitle>
          <CardDescription>
            Enter your Discord Bot token to connect to the API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Discord Bot Token</Label>
            <div className="flex">
              <Input
                id="bot-token"
                type={isTokenVisible ? "text" : "password"}
                placeholder="Enter your bot token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="bg-secondary/50 border-secondary flex-1"
              />
              <Button
                variant="outline"
                type="button"
                onClick={toggleTokenVisibility}
                className="ml-2"
              >
                {isTokenVisible ? 'Hide' : 'Show'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Never share your bot token. It provides full access to your bot.
            </p>
          </div>
          
          {status.status === 'connected' && (
            <div className="rounded-md bg-green-500/10 p-3 border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-500">
                  Connected to Discord API
                </span>
              </div>
            </div>
          )}
          
          {status.status === 'error' && (
            <div className="rounded-md bg-red-500/10 p-3 border border-red-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-red-500">
                  Connection error: {status.error}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            onClick={handleSaveToken} 
            disabled={connecting || !tokenInput.trim()}
            className="flex-1 bg-discord-blurple hover:bg-discord-blurple/90"
          >
            {connecting ? 'Connecting...' : 'Connect Bot'}
          </Button>
          {token && (
            <Button 
              variant="destructive" 
              onClick={handleClearToken}
              disabled={connecting}
            >
              Clear Token
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
