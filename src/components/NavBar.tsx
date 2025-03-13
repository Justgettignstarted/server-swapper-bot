
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { DiscordLogo } from './navbar/DiscordLogo';
import { DiscordUserProfile } from './navbar/DiscordUserProfile';

interface NavBarProps {
  className?: string;
  isAuthorized?: boolean;
  onLogout?: () => void;
  username?: string;
  isPremium?: boolean;
  premiumTier?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  className,
  isAuthorized = false,
  onLogout,
  username,
  isPremium = false,
  premiumTier = 'Pro'
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex items-center justify-between py-4 px-6 glass rounded-lg",
        className
      )}
    >
      <DiscordLogo />
      
      <div className="flex items-center gap-4">
        {isAuthorized && (
          <DiscordUserProfile 
            username={username}
            isPremium={isPremium}
            premiumTier={premiumTier}
          />
        )}
        
        {isAuthorized && onLogout && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="border-discord-darker/30 hover:bg-discord-darker hover:text-white"
          >
            Logout
          </Button>
        )}
      </div>
    </motion.div>
  );
};
