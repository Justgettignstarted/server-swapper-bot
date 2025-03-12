
import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { checkPremiumStatus, getPremiumTier } from '@/components/premium/PaymentService';
import { toast } from 'sonner';
import { getDiscordUser, clearDiscordAuth } from '@/utils/auth/discordAuth';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumTier, setPremiumTier] = useState<string | null>(null);

  useEffect(() => {
    // Get Discord user from localStorage
    const discordUser = getDiscordUser();
    if (discordUser) {
      // Format username with discriminator if available
      const formattedUsername = discordUser.discriminator && discordUser.discriminator !== '0' 
        ? `${discordUser.username}#${discordUser.discriminator}` 
        : discordUser.username;
      
      setUsername(formattedUsername);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${discordUser.username}!`);
    }
    
    // Get premium status and tier from localStorage
    const premiumStatus = checkPremiumStatus();
    setIsPremium(premiumStatus);
    
    if (premiumStatus) {
      const tier = getPremiumTier();
      setPremiumTier(tier);
    }
  }, []);

  const handleLogin = () => {
    // This function now only handles post-authentication flow
    // The actual redirect to Discord happens in the DiscordLoginButton component
    const discordUser = getDiscordUser();
    if (discordUser) {
      // Format username with discriminator if available
      const formattedUsername = discordUser.discriminator && discordUser.discriminator !== '0' 
        ? `${discordUser.username}#${discordUser.discriminator}` 
        : discordUser.username;
      
      setUsername(formattedUsername);
      setIsAuthenticated(true);
      
      // Welcome toast with the username
      toast.success(`Welcome, ${discordUser.username}!`);
    }
    
    // Check premium status on login
    const isPremiumUser = checkPremiumStatus();
    setIsPremium(isPremiumUser);
    
    if (isPremiumUser) {
      const tier = getPremiumTier();
      setPremiumTier(tier);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(undefined);
    
    // Clear Discord auth data
    clearDiscordAuth();
    toast.info('You have been logged out');
  };

  const handleUpgrade = (isPremiumStatus: boolean, tier: string) => {
    console.log(`Updating premium status: ${isPremiumStatus}, tier: ${tier}`);
    setIsPremium(isPremiumStatus);
    setPremiumTier(tier);
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Hero onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard 
            onLogout={handleLogout} 
            username={username} 
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
