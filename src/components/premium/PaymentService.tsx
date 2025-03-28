
import { createMockCheckoutSession, redirectToCheckout } from "@/utils/mockApi";
import { toast } from "sonner";
import { CheckCircle, X } from "lucide-react";

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
    
    // If user downgrades from Enterprise to Pro, we need to update the tier correctly
    const currentTier = localStorage.getItem('premiumTier');
    if (currentTier && currentTier !== tierName) {
      console.log(`Changing premium tier from ${currentTier} to ${tierName}`);
    }
    
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

// Enhanced function to cancel subscription
export const cancelSubscription = async () => {
  // In a real implementation, this would make an API call to your payment processor
  // to cancel the active subscription
  
  // For our mock implementation, show a cancellation confirmation
  toast.success("Subscription cancelled successfully", {
    description: "Your subscription has been cancelled. You will have access until the end of your billing period.",
    icon: <X className="h-4 w-4 text-red-500" />
  });
  
  // Add some delay to simulate a real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update local storage to reflect the cancellation
  localStorage.removeItem('isPremium');
  localStorage.removeItem('premiumTier');
  
  return true;
};

// Function to downgrade to basic (for testing/development)
export const downgradeToBasic = () => {
  localStorage.removeItem('isPremium');
  localStorage.removeItem('premiumTier');
  toast.info("Account downgraded to Basic plan", {
    description: "Your account has been downgraded to the Basic plan."
  });
  return true;
};
