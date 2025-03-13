
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Check, AlertCircle, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { checkPremiumStatus, getPremiumTier, cancelSubscription } from './PaymentService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const SubscriptionStatus: React.FC = () => {
  const isPremium = checkPremiumStatus();
  const currentTier = getPremiumTier() || "Basic";
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Define feature limits based on tier
  const tierLimits = {
    Basic: {
      servers: 2,
      support: "Community",
      transfers: "Basic"
    },
    Pro: {
      servers: 10,
      support: "Priority",
      transfers: "Advanced"
    },
    Enterprise: {
      servers: "Unlimited",
      support: "24/7 Dedicated",
      transfers: "Mass"
    }
  };
  
  // Get current tier limits
  const limits = tierLimits[currentTier as keyof typeof tierLimits];

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      setCancelDialogOpen(false);
      // Dispatch a storage event to notify other components about the cancellation
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className={`${isPremium ? 'bg-purple-500/10' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
          <CardTitle className="flex items-center gap-2">
            {isPremium && <Crown className="h-5 w-5 text-amber-500" />}
            <span>Your Subscription</span>
            <Badge variant={isPremium ? "default" : "outline"} className="ml-auto">
              {currentTier}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Server Connections</span>
                <span className="font-medium flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  {limits.servers}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Support Level</span>
                <span className="font-medium flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  {limits.support}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">User Transfers</span>
                <span className="font-medium flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  {limits.transfers}
                </span>
              </div>
            </div>
            
            {!isPremium && (
              <div className="bg-amber-500/10 p-3 rounded-md flex items-start gap-2 mt-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Upgrade to access more features
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Premium plans include more server connections, priority support, and advanced user verification options.
                  </p>
                </div>
              </div>
            )}

            {isPremium && (
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your {currentTier} subscription? You'll lose access to premium features at the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelSubscription();
              }} 
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
