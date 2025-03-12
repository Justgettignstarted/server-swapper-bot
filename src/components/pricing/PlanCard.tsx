
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
import { PricingPlan } from "@/data/pricingPlans";

interface PlanCardProps {
  plan: PricingPlan;
  onUpgradeClick: (tierName: string) => void;
  itemVariants: any;
}

export const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onUpgradeClick,
  itemVariants
}) => {
  // Get the appropriate icon based on the plan name
  const getPlanIcon = () => {
    switch (plan.name) {
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
    <motion.div variants={itemVariants}>
      <Card className={`h-full flex flex-col ${plan.highlight ? 'border-primary shadow-md relative overflow-hidden' : ''}`}>
        {plan.highlight && (
          <div className="absolute top-0 right-0">
            <Badge variant="default" className="m-2 bg-primary">
              Popular
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPlanIcon()}
            {plan.name}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">{plan.price}</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant={plan.buttonVariant} 
            className={`w-full ${plan.isCurrent ? 'cursor-default' : ''}`}
            disabled={plan.isCurrent}
            onClick={() => !plan.isCurrent && onUpgradeClick(plan.name)}
          >
            {plan.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
