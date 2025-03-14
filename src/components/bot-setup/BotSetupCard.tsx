
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { BotStatus } from '@/utils/discord/types';
import { TokenInput } from './TokenInput';
import { ConnectionStatus } from './ConnectionStatus';
import { TokenActions } from './TokenActions';

interface BotSetupCardProps {
  status: BotStatus;
  tokenInput: string;
  setTokenInput: (value: string) => void;
  validationMessage: string;
  setValidationMessage: (message: string) => void;
  connecting: boolean;
  token: string | null;
  handleSaveToken: () => void;
  handleClearToken: () => void;
}

export const BotSetupCard: React.FC<BotSetupCardProps> = ({
  status,
  tokenInput,
  setTokenInput,
  validationMessage,
  setValidationMessage,
  connecting,
  token,
  handleSaveToken,
  handleClearToken
}) => {
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
          <TokenInput
            token={token}
            tokenInput={tokenInput}
            setTokenInput={setTokenInput}
            validationMessage={validationMessage}
            setValidationMessage={setValidationMessage}
            connecting={connecting}
          />
          
          {(status.status === 'connected' || status.status === 'error') && (
            <ConnectionStatus status={status} />
          )}
        </CardContent>
        <CardFooter>
          <TokenActions
            handleSaveToken={handleSaveToken}
            handleClearToken={handleClearToken}
            tokenInput={tokenInput}
            validationMessage={validationMessage}
            connecting={connecting}
            hasToken={!!token}
            status={status.status}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
};
