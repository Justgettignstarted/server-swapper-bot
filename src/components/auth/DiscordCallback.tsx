
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useBot } from '@/context/BotContext';
import { Button } from '@/components/ui/button';

export const DiscordCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, checkConnection } = useBot();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the code and state from the URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        console.log("Auth callback received:", { 
          code: code ? `${code.substring(0, 6)}...` : null, 
          state, 
          error: errorParam,
          errorDescription
        });

        // Check for Discord OAuth errors
        if (errorParam) {
          console.error("Discord auth error:", errorParam, errorDescription);
          setErrorType(errorParam);
          
          const errorMessage = errorDescription || `Authentication failed: ${errorParam}`;
          setError(errorMessage);
          
          // Special handling for redirect_uri errors
          if (errorParam === 'invalid_request' && errorDescription?.includes('redirect_uri')) {
            const storedRedirectUri = localStorage.getItem('discordRedirectUri');
            console.log("Stored redirect URI:", storedRedirectUri);
            
            // More specific error handling for redirect URI mismatch
            setError(`The redirect URI doesn't match what's configured in your Discord application. 
                     Please add "${storedRedirectUri}" to your Discord application's OAuth2 redirect settings.`);
          }
          
          toast.error(errorMessage);
          setProcessing(false);
          return;
        }
        
        // Verify that we have a code
        if (!code) {
          console.error("No authorization code received");
          setErrorType('no_code');
          setError('No authorization code received');
          toast.error('Authentication failed: No code received from Discord');
          setProcessing(false);
          return;
        }

        // Verify the state to prevent CSRF attacks
        const storedState = localStorage.getItem('discordOAuthState');
        if (!state || state !== storedState) {
          console.error("Invalid state parameter", { received: state, stored: storedState });
          setErrorType('invalid_state');
          setError('Invalid state parameter');
          toast.error('Authentication failed: Security verification failed');
          setProcessing(false);
          return;
        }

        // In a production application, you would exchange this code for a token via a backend
        console.log('Received valid Discord OAuth code:', code.substring(0, 6) + "...");
        
        // Simulate successful authentication with mock data
        // In a real app, this would come from Discord's API response after token exchange
        const mockDiscordUserData = {
          id: '123456789012345678',
          username: 'DiscordUser',
          discriminator: '1234',
          avatar: null,
          email: 'user@example.com'
        };
        
        // Store the user data
        localStorage.setItem('discordUser', JSON.stringify(mockDiscordUserData));
        
        // Also set a mock bot token for demonstration purposes
        // In a real app, you would get this token from your Discord bot application
        const demoToken = "MTMwMDUwNTAyMTUwMjE5Mzc5NQ.GjoPO0.ZLojCfl8IpUJUYmnBxD0EtAokqWcjGh28j3XqE";
        setToken(demoToken);
        
        // Check the bot connection with the token
        setTimeout(() => {
          checkConnection();
        }, 500);
        
        toast.success(`Successfully authenticated with Discord!`);
        setProcessing(false);
        
        // Clear the OAuth state since we don't need it anymore
        localStorage.removeItem('discordOAuthState');
        
        // Redirect back to the home page after a short delay
        setTimeout(() => {
          console.log('Redirecting to home page...');
          navigate('/');
        }, 1500);
      } catch (err) {
        console.error('Error processing Discord callback:', err);
        setErrorType('unknown');
        setError('Failed to complete authentication');
        toast.error('Authentication failed. Please try again.');
        setProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [location, navigate, setToken, checkConnection]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center max-w-md mx-auto p-6 bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
        {error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
            <p className="text-white/80">{error}</p>
            
            {errorType === 'invalid_request' && (
              <div className="mt-4 p-4 bg-gray-700/50 rounded-md text-white/90 text-sm text-left">
                <h3 className="font-semibold mb-2">How to fix this:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Discord Developer Portal</a></li>
                  <li>Select your application</li>
                  <li>Go to OAuth2 → General</li>
                  <li>Add this redirect URL: <code className="bg-gray-700 p-1 rounded">{localStorage.getItem('discordRedirectUri')}</code></li>
                  <li>Save changes and try again</li>
                </ol>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="mt-4"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {processing ? (
              <>
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-discord-blurple" />
                <h2 className="text-2xl font-bold text-white">Authenticating with Discord</h2>
                <p className="text-white/80">Please wait while we complete the authentication process...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Authentication Successful!</h2>
                <p className="text-white/80">You have successfully authenticated with Discord.</p>
                <p className="text-white/60">Redirecting to dashboard...</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
