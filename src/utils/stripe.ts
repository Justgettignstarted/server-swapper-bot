
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51NxRrJLkdIwI9nUVMseKtIFqMiGHWJRZKkF9A0aTCnuwOsRsbF4jmK3iwfYFcDYWQKvMzIjP1OBvtfcBZrGAYgSf00RMKCMFYm';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Price IDs from Stripe dashboard
export const STRIPE_PRICES = {
  PRO: 'price_1OyrW5LkdIwI9nUVmNuLOzOw',
  ENTERPRISE: 'price_1OyrXHLkdIwI9nUVoR5gyvku',
};

// Create a Stripe Checkout Session
export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
