
import React from 'react';
import { DiscordLoginButton } from './DiscordLoginButton';
import { motion } from 'framer-motion';

interface HeroProps {
  onLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center text-center my-16 md:my-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-1/2"></div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Discord Server Transfer
            </h1>
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Seamlessly transfer members between Discord servers using secure OAuth2 authorization
        </p>
        
        <DiscordLoginButton onLogin={onLogin} className="mx-auto" />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            {
              title: 'Secure OAuth2',
              description: 'Uses Discord\'s official OAuth2 for secure authorization'
            },
            {
              title: 'Fast Transfers',
              description: 'Efficiently transfer members between servers'
            },
            {
              title: 'Policy Compliant',
              description: 'Follows Discord\'s Terms of Service and guidelines'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="glass p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
