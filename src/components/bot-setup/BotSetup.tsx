
import React, { useState, useEffect } from 'react';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { BotSetupCard } from './BotSetupCard';
import { validateTokenFormat } from '@/utils/discord/api/base';

export const BotSetup = () => {
  const { token, setToken, status, checkConnection, connecting } = useBot();
  const [tokenInput, setTokenInput] = useState(token || '');
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

  return (
    <BotSetupCard
      status={status}
      tokenInput={tokenInput}
      setTokenInput={setTokenInput}
      validationMessage={validationMessage}
      setValidationMessage={setValidationMessage}
      connecting={connecting}
      token={token}
      handleSaveToken={handleSaveToken}
      handleClearToken={handleClearToken}
    />
  );
};
