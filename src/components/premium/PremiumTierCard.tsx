
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
import { Shield, Users, Zap, BarChart } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumTierProps {
  tier: {
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "default" | "outline";
    isCurrent: boolean;
    highlight: boolean;
    priceId: string | null;
  };
  onUpgradeClick: (tierName: string) => void;
}

export const PremiumTierCard: React.FC<PremiumTierProps> = ({ 
  tier, 
  onUpgradeClick 
}) => {
  const renderTierIcon = (name: string) => {
    switch(name) {
      case "Basic":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "Pro":
        return <Zap className="h-5 w-5 text-amber-500" />;
      case "Enterprise":
        return <BarChart className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5
        }
      }
    }}>
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
            {renderTierIcon(tier.name)}
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
            onClick={() => !tier.isCurrent && onUpgradeClick(tier.name)}
          >
            {tier.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
