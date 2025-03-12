
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChannelsTabProps {
  channels: any[];
  loading: boolean;
}

export const ChannelsTab: React.FC<ChannelsTabProps> = ({ channels, loading }) => {
  if (loading) {
    return <div className="text-center py-4">Loading channels...</div>;
  }

  if (channels.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No channels found</div>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {channels.map(channel => (
        <div key={channel.id} className="p-2 rounded-md bg-background/50 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{channel.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other'}
          </span>
        </div>
      ))}
    </div>
  );
};
