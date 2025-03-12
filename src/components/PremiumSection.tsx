
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useBot } from "@/context/BotContext";
import { toast } from "sonner";
import { PremiumTierCard } from "./premium/PremiumTierCard";
import { UpgradeDialog } from "./premium/UpgradeDialog";
import { PremiumHeader } from "./premium/PremiumHeader";
import { pricingTiers } from "./premium/PricingData";
import { processPayment, checkPremiumStatus, getPremiumTier } from "./premium/PaymentService";

interface PremiumSectionProps {
  onUpgrade?: (isPremium: boolean, tier: string) => void;
}

export const PremiumSection: React.FC<PremiumSectionProps> = ({ onUpgrade }) => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>("Basic");
  const { executeCommand } = useBot();

  useEffect(() => {
    // Check if user is already premium when component mounts
    if (checkPremiumStatus()) {
      const tier = getPremiumTier() || "Pro";
      setCurrentTier(tier);
    }
  }, []);

  const handleUpgradeClick = (tierName: string) => {
    setSelectedTier(tierName);
    setUpgradeDialogOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedTier) return;
    
    setIsProcessing(true);
    
    try {
      // Find the selected tier
      const tier = pricingTiers.find(t => t.name === selectedTier);
      
      if (!tier || !tier.priceId) {
        throw new Error('Invalid tier or missing price ID');
      }
      
      const success = await processPayment(selectedTier, tier.priceId);
      
      if (success) {
        // Update the current tier locally
        setCurrentTier(selectedTier);
        
        // Notify parent component about the upgrade
        if (onUpgrade) {
          onUpgrade(true, selectedTier);
        }
      }
      
      setUpgradeDialogOpen(false);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Create updated pricing tiers with current plan marked
  const updatedPricingTiers = pricingTiers.map(tier => ({
    ...tier,
    isCurrent: tier.name === currentTier
  }));

  return (
    <div className="w-full">
      <PremiumHeader />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {updatedPricingTiers.map((tier) => (
          <PremiumTierCard 
            key={tier.name} 
            tier={tier} 
            onUpgradeClick={handleUpgradeClick} 
          />
        ))}
      </motion.div>

      <UpgradeDialog 
        isOpen={upgradeDialogOpen}
        selectedTier={selectedTier}
        isProcessing={isProcessing}
        onOpenChange={setUpgradeDialogOpen}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
};
