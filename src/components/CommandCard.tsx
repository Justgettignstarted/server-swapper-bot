
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommandCardProps {
  command: string;
  description: string;
  example?: string;
  className?: string;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  description,
  example,
  className
}) => {
  return (
    <Card className={cn('glass overflow-hidden transition-all hover:translate-y-[-2px] duration-300', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-xs bg-primary/10 border-primary/30 text-primary-foreground">
            {command}
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium mt-2">{description}</CardTitle>
      </CardHeader>
      {example && (
        <CardContent className="pt-0">
          <CardDescription className="font-mono text-xs bg-muted p-2 rounded-md">
            {example}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
};
