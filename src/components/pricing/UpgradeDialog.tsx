
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { pricingPlans } from "@/data/pricingPlans";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: string | null;
  isProcessing: boolean;
  onConfirm: () => Promise<void>;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open,
  onOpenChange,
  selectedTier,
  isProcessing,
  onConfirm
}) => {
  const plan = selectedTier ? pricingPlans.find(p => p.name === selectedTier) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
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
  );
};
