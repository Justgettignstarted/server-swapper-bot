
import React from 'react';
import { Button } from '@/components/ui/button';

interface TokenActionsProps {
  handleSaveToken: () => void;
  handleClearToken: () => void;
  tokenInput: string;
  validationMessage: string;
  connecting: boolean;
  hasToken: boolean;
  status: string;
}

export const TokenActions: React.FC<TokenActionsProps> = ({
  handleSaveToken,
  handleClearToken,
  tokenInput,
  validationMessage,
  connecting,
  hasToken,
  status
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleSaveToken} 
        disabled={connecting || !tokenInput.trim() || !!validationMessage}
        className="flex-1 bg-discord-blurple hover:bg-discord-blurple/90"
      >
        {connecting ? 'Connecting...' : status === 'connected' ? 'Reconnect Bot' : 'Connect Bot'}
      </Button>
      {hasToken && (
        <Button 
          variant="destructive" 
          onClick={handleClearToken}
          disabled={connecting}
        >
          Clear Token
        </Button>
      )}
    </div>
  );
};
