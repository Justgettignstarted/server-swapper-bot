
import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { checkPremiumStatus, getPremiumTier } from '@/components/premium/PaymentService';
import { toast } from 'sonner';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumTier, setPremiumTier] = useState<string | null>(null);

  useEffect(() => {
    // Get username from localStorage (would come from Discord OAuth in production)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${storedUsername.split('#')[0]}!`);
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
    // In a real app, this would be handled by the Discord OAuth callback
    // Here we're relying on the DiscordLoginButton component to set the username
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
      
      // Welcome toast with just the username part (without discriminator)
      const displayName = storedUsername.split('#')[0];
      toast.success(`Welcome, ${displayName}!`);
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
    
    localStorage.removeItem('username');
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
