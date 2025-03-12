
// This file simulates a backend API for Stripe integration
// In a real application, this would be a server-side endpoint

export const createMockCheckoutSession = async (priceId: string) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would create a Stripe checkout session
  // and return the session ID
  const mockSessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  return { sessionId: mockSessionId };
};

export const redirectToCheckout = async (sessionId: string) => {
  // Simulate redirection to Stripe Checkout
  console.log(`Redirecting to Stripe Checkout with session ID: ${sessionId}`);
  
  // Simulate checkout process
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return success or failure based on a random outcome (for demo purposes)
  // In a real app, this would be determined by the actual payment outcome
  const isSuccessful = Math.random() > 0.2; // 80% success rate for demo
  
  return { success: isSuccessful };
};
