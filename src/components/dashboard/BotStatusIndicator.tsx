
import React from 'react';
import { BotStatus } from '@/utils/discord/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BotStatusIndicatorProps {
  status: BotStatus;
}

export const BotStatusIndicator: React.FC<BotStatusIndicatorProps> = ({ status }) => {
  const lastCheckedTime = status.lastChecked 
    ? new Date(status.lastChecked).toLocaleTimeString() 
    : 'Never';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-sm flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              status.status === 'connected' ? 'bg-green-500' : 
              status.status === 'connecting' ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}></div>
            <span>
              Bot Status: {
                status.status === 'connected' ? 'Online' : 
                status.status === 'connecting' ? 'Connecting...' : 
                'Offline'
              }
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last checked: {lastCheckedTime}</p>
          {status.error && <p className="text-red-500">{status.error}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
