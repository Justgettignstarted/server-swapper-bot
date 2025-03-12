
import React, { useState } from 'react';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isPremium, setIsPremium] = useState(false); // Default to not premium

  const handleLogin = () => {
    // In a real app, this would come from Discord OAuth
    setUsername("DiscordUser" + Math.floor(Math.random() * 10000));
    setIsAuthenticated(true);
    
    // Randomly set some users as premium for demonstration purposes
    setIsPremium(Math.random() > 0.5);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(undefined);
    setIsPremium(false);
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
          <Dashboard onLogout={handleLogout} username={username} isPremium={isPremium} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
