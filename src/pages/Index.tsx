
import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { checkPremiumStatus, getPremiumTier } from '@/components/premium/PaymentService';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumTier, setPremiumTier] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
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
    const newUsername = "DiscordUser" + Math.floor(Math.random() * 10000);
    setUsername(newUsername);
    setIsAuthenticated(true);
    
    localStorage.setItem('username', newUsername);
    
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
