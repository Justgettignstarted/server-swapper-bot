import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TransferForm } from './transfer/TransferForm';
import { TransferProgress } from './transfer/TransferProgress';
import { useServerTransfer } from '@/hooks/useServerTransfer';

export const ServerTransferSection = () => {
  const {
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
  } = useServerTransfer();

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
          <TransferForm
            serverId={serverId}
            setServerId={setServerId}
            amount={amount}
            setAmount={setAmount}
            isProcessing={isProcessing}
            onStartTransfer={handleStartTransfer}
          />
          
          {isProcessing && (
            <TransferProgress
              progress={progress}
              usersTransferred={usersTransferred}
              totalUsers={totalUsers}
              targetServer={targetServer}
              transferId={transferId}
              onCancelTransfer={handleCancelTransfer}
            />
          )}
        </CardContent>
        <CardFooter>
          {/* Footer is now handled in the respective component */}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
