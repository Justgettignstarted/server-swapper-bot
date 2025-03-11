
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  className
}) => {
  return (
    <Card className={cn("glass overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-2xl font-bold mt-1">{value}</p>
            </motion.div>
          </div>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
