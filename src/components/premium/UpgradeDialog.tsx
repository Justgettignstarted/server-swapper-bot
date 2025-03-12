
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

interface UpgradeDialogProps {
  isOpen: boolean;
  selectedTier: string | null;
  isProcessing: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmUpgrade: () => Promise<void>;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  isOpen,
  selectedTier,
  isProcessing,
  onOpenChange,
  onConfirmUpgrade
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={onConfirmUpgrade}
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
