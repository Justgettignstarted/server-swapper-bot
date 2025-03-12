
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServerSelectorProps {
  selectedGuild: string;
  setSelectedGuild: (guildId: string) => void;
  guilds: any[];
  loading: boolean;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({ 
  selectedGuild, 
  setSelectedGuild, 
  guilds, 
  loading 
}) => {
  return (
    <div className="mt-4">
      <Select
        value={selectedGuild}
        onValueChange={setSelectedGuild}
        disabled={loading || guilds.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a server" />
        </SelectTrigger>
        <SelectContent>
          {guilds.map(guild => (
            <SelectItem key={guild.id} value={guild.id}>
              {guild.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
