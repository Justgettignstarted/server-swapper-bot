
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Shield, Users, BarChart, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBot } from "@/context/BotContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createMockCheckoutSession, redirectToCheckout } from "@/utils/mockApi";

export const PremiumSection: React.FC = () => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { executeCommand } = useBot();

  const tiers = [
    {
      name: "Basic",
      price: "Free",
      description: "Essential features for personal use",
      features: [
        "Up to 2 server connections",
        "Basic user transfers",
        "Standard response time",
        "Community support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      isCurrent: true,
      highlight: false,
      priceId: null
    },
    {
      name: "Pro",
      price: "$9.99/mo",
      description: "Advanced features for growing communities",
      features: [
        "Up to 10 server connections",
        "Advanced user verification",
        "Priority support response",
        "Custom bot settings",
        "Transfer statistics"
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      isCurrent: false,
      highlight: true,
      priceId: "price_1OyrW5LkdIwI9nUVmNuLOzOw"
    },
    {
      name: "Enterprise",
      price: "$24.99/mo",
      description: "Maximum power for large communities",
      features: [
        "Unlimited server connections",
        "Mass user transfers",
        "24/7 dedicated support",
        "Custom bot branding",
        "Advanced analytics",
        "Developer API access"
      ],
      buttonText: "Upgrade to Enterprise",
      buttonVariant: "outline" as const,
      isCurrent: false,
      highlight: false,
      priceId: "price_1OyrXHLkdIwI9nUVoR5gyvku"
    }
  ];

  const handleUpgradeClick = (tierName: string) => {
    setSelectedTier(tierName);
    setUpgradeDialogOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedTier) return;
    
    setIsProcessing(true);
    
    try {
      // Find the selected tier
      const tier = tiers.find(t => t.name === selectedTier);
      
      if (!tier || !tier.priceId) {
        throw new Error('Invalid tier or missing price ID');
      }
      
      // Create a checkout session
      const { sessionId } = await createMockCheckoutSession(tier.priceId);
      
      // Redirect to checkout
      const { success } = await redirectToCheckout(sessionId);
      
      if (success) {
        toast.success(`Successfully upgraded to ${selectedTier} plan!`, {
          description: "Your payment was processed successfully. Your new benefits are now available.",
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        });
      } else {
        toast.error("Payment failed", {
          description: "The payment could not be processed. Please try again or use a different payment method."
        });
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
        {tiers.map((tier, index) => (
          <motion.div key={tier.name} variants={itemVariants}>
            <Card className={`h-full flex flex-col ${tier.highlight ? 'border-primary shadow-md relative overflow-hidden' : ''}`}>
              {tier.highlight && (
                <div className="absolute top-0 right-0">
                  <Badge variant="default" className="m-2 bg-primary">
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tier.name === "Basic" && <Users className="h-5 w-5 text-blue-500" />}
                  {tier.name === "Pro" && <Zap className="h-5 w-5 text-amber-500" />}
                  {tier.name === "Enterprise" && <BarChart className="h-5 w-5 text-purple-500" />}
                  {tier.name}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={tier.buttonVariant} 
                  className={`w-full ${tier.isCurrent ? 'cursor-default' : ''}`}
                  disabled={tier.isCurrent}
                  onClick={() => !tier.isCurrent && handleUpgradeClick(tier.name)}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedTier} Plan</DialogTitle>
            <DialogDescription>
              You're about to upgrade your subscription. This will be charged to your payment method on file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-semibold mb-2">Plan Details:</h3>
            {selectedTier === "Pro" && (
              <div className="space-y-2">
                <p>• <strong>Price:</strong> $9.99/month</p>
                <p>• <strong>Features:</strong> Up to 10 server connections, advanced verification, priority support</p>
                <p>• <strong>Billing:</strong> You'll be charged immediately and then monthly</p>
              </div>
            )}
            {selectedTier === "Enterprise" && (
              <div className="space-y-2">
                <p>• <strong>Price:</strong> $24.99/month</p>
                <p>• <strong>Features:</strong> Unlimited servers, mass transfers, developer API access</p>
                <p>• <strong>Billing:</strong> You'll be charged immediately and then monthly</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUpgradeDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? 
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div> : 
                "Confirm Payment"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
