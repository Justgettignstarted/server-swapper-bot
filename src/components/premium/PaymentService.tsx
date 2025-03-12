
import { createMockCheckoutSession, redirectToCheckout } from "@/utils/mockApi";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export const processPayment = async (tierName: string, priceId: string | null) => {
  if (!priceId) {
    throw new Error('Invalid tier or missing price ID');
  }
  
  // Create a checkout session
  const { sessionId } = await createMockCheckoutSession(priceId);
  
  // Redirect to checkout
  const { success } = await redirectToCheckout(sessionId);
  
  if (success) {
    toast.success(`Successfully upgraded to ${tierName} plan!`, {
      description: "Your payment was processed successfully. Your new benefits are now available.",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
    
    // Store premium status in localStorage for persistence
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumTier', tierName);
    
    // Return true to indicate success and trigger UI updates
    return true;
  } else {
    toast.error("Payment failed", {
      description: "The payment could not be processed. Please try again or use a different payment method."
    });
    return false;
  }
};

// Function to check if user is premium
export const checkPremiumStatus = () => {
  return localStorage.getItem('isPremium') === 'true';
};

// Function to get the current premium tier
export const getPremiumTier = () => {
  return localStorage.getItem('premiumTier') || null;
};
