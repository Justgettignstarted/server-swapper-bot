
import React from 'react';
import { BotStatus } from '@/utils/discord/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface BotStatusIndicatorProps {
  status: BotStatus;
}

export const BotStatusIndicator: React.FC<BotStatusIndicatorProps> = ({ status }) => {
  const lastCheckedTime = status.lastChecked 
    ? new Date(status.lastChecked).toLocaleTimeString() 
    : 'Never';

  // Pulse animation for connecting state
  const isConnecting = status.status === 'connecting';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-sm flex items-center gap-2">
            {isConnecting ? (
              <motion.div 
                className="w-3 h-3 rounded-full bg-yellow-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            ) : (
              <div className={`w-3 h-3 rounded-full ${
                status.status === 'connected' ? 'bg-green-500' : 
                'bg-red-500'
              }`}></div>
            )}
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
          {isConnecting && <p className="text-yellow-500">Checking connection...</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
