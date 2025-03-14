
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info } from 'lucide-react';
import { validateTokenFormat } from '@/utils/discord/api/base';

interface TokenInputProps {
  token: string | null;
  tokenInput: string;
  setTokenInput: (value: string) => void;
  validationMessage: string;
  setValidationMessage: (message: string) => void;
  connecting: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  tokenInput,
  setTokenInput,
  validationMessage,
  setValidationMessage,
  connecting,
}) => {
  const [isTokenVisible, setIsTokenVisible] = useState(false);

  const toggleTokenVisibility = () => {
    setIsTokenVisible(!isTokenVisible);
  };

  const validateToken = (token: string) => {
    if (!token.trim()) {
      setValidationMessage('Please enter a bot token');
      return false;
    }

    if (!validateTokenFormat(token)) {
      setValidationMessage('Invalid token format. Discord bot tokens contain two periods (.)');
      return false;
    }

    setValidationMessage('');
    return true;
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
  );
};
