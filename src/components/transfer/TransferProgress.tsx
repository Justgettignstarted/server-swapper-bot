
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Server } from 'lucide-react';

interface TransferProgressProps {
  progress: number;
  usersTransferred: number;
  totalUsers: number;
  targetServer: {id: string, name: string} | null;
  transferId: string | null;
  onCancelTransfer: () => void;
}

export const TransferProgress: React.FC<TransferProgressProps> = ({
  progress,
  usersTransferred,
  totalUsers,
  targetServer,
  transferId,
  onCancelTransfer
}) => {
  return (
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
      
      <Button 
        onClick={onCancelTransfer}
        variant="destructive"
        className="w-full"
        disabled={progress >= 100}
      >
        {progress >= 100 ? 'Transfer Complete' : 'Cancel Transfer'}
      </Button>
    </div>
  );
};
