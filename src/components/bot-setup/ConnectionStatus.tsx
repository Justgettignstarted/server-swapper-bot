
import React from 'react';
import { BotStatus } from '@/utils/discord/types';

interface ConnectionStatusProps {
  status: BotStatus;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  if (status.status === 'connected') {
    return (
      <div className="rounded-md bg-green-500/10 p-3 border border-green-500/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-green-500">
            Connected to Discord API
          </span>
        </div>
        {status.botInfo && (
          <div className="mt-2 text-xs">
            <p><strong>Bot Name:</strong> {status.botInfo.username}#{status.botInfo.discriminator || '0'}</p>
            {status.botInfo.id && <p><strong>Bot ID:</strong> {status.botInfo.id}</p>}
          </div>
        )}
      </div>
    );
  }
  
  if (status.status === 'error') {
    return (
      <div className="rounded-md bg-red-500/10 p-3 border border-red-500/30">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-500">
              Connection error
            </span>
          </div>
          <p className="text-xs text-red-400">
            {status.error || "Failed to connect to Discord API. Please check your token."}
          </p>
          <div className="text-xs text-red-300 mt-1">
            Make sure:
            <ul className="list-disc ml-5 mt-1">
              <li>Your bot token is correct</li>
              <li>The bot is online and not disabled</li>
              <li>The bot has the necessary permissions and intents</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};
