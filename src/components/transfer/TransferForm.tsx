
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBot } from '@/context/BotContext';

interface TransferFormProps {
  serverId: string;
  setServerId: (id: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  isProcessing: boolean;
  onStartTransfer: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  serverId,
  setServerId,
  amount,
  setAmount,
  isProcessing,
  onStartTransfer
}) => {
  const { isConnected } = useBot();

  const handleSubmit = () => {
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
    
    onStartTransfer();
  };

  return (
    <div className="space-y-4">
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
      {!isProcessing && (
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing || !isConnected} 
          className="w-full bg-discord-blurple hover:bg-discord-blurple/90 btn-shine"
        >
          Start Transfer
        </Button>
      )}
    </div>
  );
};
