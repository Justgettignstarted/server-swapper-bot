
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle, Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface DiscordLoginButtonProps {
  className?: string;
  onLogin: () => void;
}

// Discord Client ID from environment variable
const DEFAULT_DISCORD_CLIENT_ID = '1349215809288929290';

export const DiscordLoginButton: React.FC<DiscordLoginButtonProps> = ({
  className,
  onLogin
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectInfo, setShowRedirectInfo] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    
    try {
      // Get the client ID from environment variables or use the default
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || DEFAULT_DISCORD_CLIENT_ID;
      
      // Use the current origin to dynamically create the redirect URI
      // This ensures it works in both local development and production
      const currentOrigin = window.location.origin; // e.g. http://localhost:8080
      const redirectUri = `${currentOrigin}/auth/callback`;
      
      // Log the redirect URI to help with debugging
      console.log("Discord OAuth Redirect URI:", redirectUri);
      
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      
      // Updated scope list with all the permissions we need for the application
      // identify: Basic user info
      // email: Get user's email address
      // guilds: View user's servers
      // guilds.members.read: View members in servers
      // guilds.join: Add users to guilds (for transfer functionality)
      // connections: View user's connections to other services
      const scope = encodeURIComponent('identify email guilds guilds.members.read guilds.join connections');
      
      const state = crypto.randomUUID(); // Generate a random state for security
      
      // Store the state in localStorage to verify when the user comes back
      localStorage.setItem('discordOAuthState', state);
      localStorage.setItem('discordRedirectUri', redirectUri); // Store for debugging
      
      // Show redirect URI info for configuration
      setShowRedirectInfo(true);
      
      // Redirect to Discord's OAuth page with correct parameters
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&prompt=consent&state=${state}`;
      
      console.log("Discord Auth URL:", authUrl);
      
      // Add small delay to ensure users see the info before redirect
      setTimeout(() => {
        window.location.href = authUrl;
      }, 800);
    } catch (error) {
      console.error("Discord auth error:", error);
      setIsLoading(false);
      toast.error("Failed to connect to Discord. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="lg"
          className={cn(
            'bg-discord-blurple hover:bg-discord-blurple/90 text-white font-medium px-6 h-12 btn-shine',
            'flex items-center gap-2 rounded-md transition-all duration-300 shadow-lg',
            isLoading ? 'opacity-90' : '',
            className
          )}
          onClick={handleClick}
          disabled={isLoading}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-3"
          >
            {/* Discord Logo */}
            <svg width="24" height="24" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978Z" fill="currentColor"/>
            </svg>

            {isLoading ? 'Redirecting...' : 'Authorize with Discord'}
            
            {isLoading && (
              <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.div>
        </Button>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 text-gray-400 hover:text-white hover:bg-discord-darker/20"
            >
              <Info className="h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-semibold">What permissions are needed?</h3>
              <p className="text-sm text-muted-foreground">
                This app requires Discord permissions to:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• View your Discord profile info</li>
                <li>• See your servers and members (for transfers)</li>
                <li>• Add users to servers (for server swapping)</li>
                <li>• View your connections to other services</li>
              </ul>
              <p className="text-xs text-muted-foreground pt-2 italic">
                All data is securely processed and never shared with third parties.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {showRedirectInfo && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm max-w-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Important: Configure Redirect URI</p>
              <p className="mb-2">Make sure this exact redirect URI is added to your Discord application OAuth2 settings:</p>
              <code className="bg-amber-100 p-1.5 rounded block break-all">
                {localStorage.getItem('discordRedirectUri')}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
