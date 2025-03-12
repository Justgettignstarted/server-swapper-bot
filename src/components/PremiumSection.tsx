
import React, { useState } from 'react';
import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useBot } from "@/context/BotContext";
import { toast } from "sonner";
import { pricingPlans } from "@/data/pricingPlans";
import { PlanCard } from "@/components/pricing/PlanCard";
import { UpgradeDialog } from "@/components/pricing/UpgradeDialog";
import { processPayment } from "@/services/paymentService";

export const PremiumSection: React.FC = () => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { executeCommand } = useBot();

  const handleUpgradeClick = (tierName: string) => {
    setSelectedTier(tierName);
    setUpgradeDialogOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedTier) return;
    
    setIsProcessing(true);
    
    try {
      // Find the selected tier
      const tier = pricingPlans.find(t => t.name === selectedTier);
      
      if (!tier || !tier.priceId) {
        throw new Error('Invalid tier or missing price ID');
      }
      
      await processPayment(tier.priceId, selectedTier);
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold">Premium Plans</h2>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Unlock additional features and boost your server management capabilities with our premium plans.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pricingPlans.map((plan) => (
          <PlanCard 
            key={plan.name}
            plan={plan}
            onUpgradeClick={handleUpgradeClick}
            itemVariants={itemVariants}
          />
        ))}
      </motion.div>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        selectedTier={selectedTier}
        isProcessing={isProcessing}
        onConfirm={handleConfirmUpgrade}
      />
    </div>
  );
};
