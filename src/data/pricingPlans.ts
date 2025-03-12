
export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  isCurrent: boolean;
  highlight: boolean;
  priceId: string | null;
}

export const pricingPlans: PricingPlan[] = [
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
    buttonVariant: "outline",
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
    buttonVariant: "default",
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
    buttonVariant: "outline",
    isCurrent: false,
    highlight: false,
    priceId: "price_1OyrXHLkdIwI9nUVoR5gyvku"
  }
];
