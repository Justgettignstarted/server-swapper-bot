
import React from 'react';
import { Users } from 'lucide-react';

interface MembersTabProps {
  members: any[];
  loading: boolean;
}

export const MembersTab: React.FC<MembersTabProps> = ({ members, loading }) => {
  if (loading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  if (members.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No members found</div>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {members.map(member => (
        <div key={member.user?.id || member.id} className="p-2 rounded-md bg-background/50 flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">
            {member.user?.username || member.username || 'Unknown User'}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {member.roles?.length || 0} roles
          </span>
        </div>
      ))}
    </div>
  );
};
