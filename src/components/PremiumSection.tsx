
import React from 'react';
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
import { Crown, Zap, Shield, Users, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export const PremiumSection: React.FC = () => {
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
      highlight: false
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
      highlight: true
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
      highlight: false
    }
  ];

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
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
