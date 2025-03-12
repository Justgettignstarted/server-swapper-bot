
import React from 'react';
import { Crown } from 'lucide-react';

export const PremiumHeader: React.FC = () => {
  return (
    <div className="mb-6 text-center space-y-2">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Crown className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold">Premium Plans</h2>
      </div>
      <p className="text-muted-foreground max-w-lg mx-auto">
        Unlock additional features and boost your server management capabilities with our premium plans.
      </p>
    </div>
  );
};
