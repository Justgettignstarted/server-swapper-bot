
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

// Mock Discord API response for local development
const mockDiscordUserResponse = {
  id: '123456789012345678',
  username: 'discord_user',
  discriminator: '1234',
  avatar: null,
  global_name: 'Discord User',
  email: 'user@example.com',
  verified: true,
  banner: null,
  accent_color: 5793266,
  premium_type: 2
};

export const DiscordCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your Discord login...');
  
  useEffect(() => {
    const processDiscordCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        // Check if there was an error
        if (error) {
          console.error("Discord auth error:", error);
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          toast.error("Discord authentication failed");
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        
        // Check if code and state are present
        if (!code || !state) {
          console.error("Missing code or state parameter");
          setStatus('error');
          setMessage("Invalid authentication response");
          toast.error("Invalid authentication response");
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        
        // Verify state matches what we sent
        const storedState = localStorage.getItem('discordOAuthState');
        if (state !== storedState) {
          console.error("State mismatch", { received: state, stored: storedState });
          setStatus('error');
          setMessage("Security validation failed");
          toast.error("Security validation failed");
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        
        // In a real application, we would now exchange the code for an access token
        // and then use the token to fetch the user's profile.
        // For this demo, we'll simulate a successful login with mock data.
        
        console.log("Auth code received:", code);
        setMessage("Exchanging code for access token...");
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setMessage("Loading your Discord profile...");
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock user data - in a real implementation, this would come from the Discord API
        const userData = mockDiscordUserResponse;
        
        // Store the user data in localStorage
        localStorage.setItem('discordUser', JSON.stringify(userData));
        
        // Format username for display
        const formattedUsername = userData.global_name || 
          (userData.discriminator !== '0' 
            ? `${userData.username}#${userData.discriminator}` 
            : userData.username);
        
        localStorage.setItem('username', formattedUsername);
        
        setStatus('success');
        setMessage(`Welcome, ${userData.global_name || userData.username}!`);
        
        // Redirect back to the homepage after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error("Error processing Discord callback:", error);
        setStatus('error');
        setMessage("An error occurred while processing your login");
        toast.error("Authentication failed. Please try again.");
        
        // Redirect back to the homepage after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };
    
    processDiscordCallback();
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-discord-darker/90 p-8 rounded-lg shadow-xl border border-discord-blurple/20 max-w-md w-full"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-discord-blurple/10 flex items-center justify-center mb-4">
            {status === 'processing' ? (
              <LoaderCircle className="h-8 w-8 text-discord-blurple animate-spin" />
            ) : status === 'success' ? (
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            {status === 'processing' ? 'Authenticating with Discord' : 
             status === 'success' ? 'Authentication Successful' : 
             'Authentication Failed'}
          </h2>
          
          <p className="text-gray-300 mb-6">{message}</p>
          
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-discord-blurple"
            >
              Redirecting you to the dashboard...
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-red-400"
            >
              Redirecting you back to the home page...
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
