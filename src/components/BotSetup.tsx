
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBot } from '@/context/BotContext';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { validateTokenFormat } from '@/utils/discord/api/base';

export const BotSetup = () => {
  const { token, setToken, status, checkConnection, connecting } = useBot();
  const [tokenInput, setTokenInput] = useState(token || '');
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    // When token changes externally, update the input
    if (token !== tokenInput) {
      setTokenInput(token || '');
    }
  }, [token]);

  const validateToken = (token: string) => {
    if (!token.trim()) {
      setValidationMessage('Please enter a bot token');
      return false;
    }

    // Use the more comprehensive validation from our utility
    if (!validateTokenFormat(token)) {
      setValidationMessage('Invalid token format. Discord bot tokens contain two periods (.)');
      return false;
    }

    setValidationMessage('');
    return true;
  };

  const handleSaveToken = () => {
    if (!validateToken(tokenInput)) {
      toast.error(validationMessage);
      return;
    }
    
    setToken(tokenInput.trim());
    toast.success('Bot token saved');
    checkConnection();
  };
  
  const handleClearToken = () => {
    setToken('');
    setTokenInput('');
    setValidationMessage('');
    toast.info('Bot token cleared');
  };
  
  const toggleTokenVisibility = () => {
    setIsTokenVisible(!isTokenVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTokenInput(value);
    if (value) {
      validateToken(value);
    } else {
      setValidationMessage('');
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
                onChange={handleInputChange}
                className="bg-secondary/50 border-secondary flex-1"
                disabled={connecting}
              />
              <Button
                variant="outline"
                type="button"
                onClick={toggleTokenVisibility}
                className="ml-2"
                disabled={connecting}
              >
                {isTokenVisible ? 'Hide' : 'Show'}
              </Button>
            </div>
            {validationMessage && (
              <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {validationMessage}
              </div>
            )}
            <div className="text-xs flex items-start gap-1 mt-1 text-muted-foreground">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <div>
                <p>Never share your bot token. It provides full access to your bot.</p>
                <p className="mt-1">To get a bot token:</p>
                <ol className="list-decimal ml-4 mt-1">
                  <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Discord Developer Portal</a></li>
                  <li>Create a New Application</li>
                  <li>Go to the Bot tab and click "Add Bot"</li>
                  <li>Click "Reset Token" to view your token</li>
                  <li>Make sure your bot has the necessary intents enabled (Message Content, Server Members, etc.)</li>
                </ol>
              </div>
            </div>
          </div>
          
          {status.status === 'connected' && (
            <div className="rounded-md bg-green-500/10 p-3 border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-500">
                  Connected to Discord API
                </span>
              </div>
              {status.botInfo && (
                <div className="mt-2 text-xs">
                  <p><strong>Bot Name:</strong> {status.botInfo.username}#{status.botInfo.discriminator || '0'}</p>
                  {status.botInfo.id && <p><strong>Bot ID:</strong> {status.botInfo.id}</p>}
                </div>
              )}
            </div>
          )}
          
          {status.status === 'error' && (
            <div className="rounded-md bg-red-500/10 p-3 border border-red-500/30">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-500">
                    Connection error
                  </span>
                </div>
                <p className="text-xs text-red-400">
                  {status.error || "Failed to connect to Discord API. Please check your token."}
                </p>
                <div className="text-xs text-red-300 mt-1">
                  Make sure:
                  <ul className="list-disc ml-5 mt-1">
                    <li>Your bot token is correct</li>
                    <li>The bot is online and not disabled</li>
                    <li>The bot has the necessary permissions and intents</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            onClick={handleSaveToken} 
            disabled={connecting || !tokenInput.trim() || !!validationMessage}
            className="flex-1 bg-discord-blurple hover:bg-discord-blurple/90"
          >
            {connecting ? 'Connecting...' : status.status === 'connected' ? 'Reconnect Bot' : 'Connect Bot'}
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
