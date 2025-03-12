
import React from 'react';

interface RolesTabProps {
  roles: any[];
  loading: boolean;
}

export const RolesTab: React.FC<RolesTabProps> = ({ roles, loading }) => {
  if (loading) {
    return <div className="text-center py-4">Loading roles...</div>;
  }

  if (roles.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No roles found</div>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {roles.map(role => (
        <div key={role.id} className="p-2 rounded-md bg-background/50 flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: `#${role.color.toString(16).padStart(6, '0')}` }}
          ></div>
          <span className="text-sm">{role.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Position: {role.position}
          </span>
        </div>
      ))}
    </div>
  );
};
