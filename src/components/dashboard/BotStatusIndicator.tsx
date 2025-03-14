
import React from 'react';
import { BotStatus } from '@/utils/discord/types';

interface BotStatusIndicatorProps {
  status: BotStatus;
}

export const BotStatusIndicator: React.FC<BotStatusIndicatorProps> = ({ status }) => {
  return (
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
  );
};
