
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const DiscordCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the code and state from the URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');
        
        console.log("Auth callback received:", { 
          code: code ? `${code.substring(0, 6)}...` : null, 
          state, 
          error: errorParam 
        });
        
        // Verify that we have a code and there's no error
        if (errorParam) {
          console.error("Discord auth error:", errorParam);
          setError(`Authentication failed: ${errorParam}`);
          toast.error(`Discord authentication failed: ${errorParam}`);
          setProcessing(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        if (!code) {
          console.error("No authorization code received");
          setError('No authorization code received');
          toast.error('Authentication failed: No code received from Discord');
          setProcessing(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Verify the state to prevent CSRF attacks
        const storedState = localStorage.getItem('discordOAuthState');
        if (!state || state !== storedState) {
          console.error("Invalid state parameter", { received: state, stored: storedState });
          setError('Invalid state parameter');
          toast.error('Authentication failed: Security verification failed');
          setProcessing(false);
          setTimeout(() => navigate('/'), 3000);
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
        setError('Failed to complete authentication');
        toast.error('Authentication failed. Please try again.');
        setProcessing(false);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center max-w-md mx-auto p-6 bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
        {error ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
            <p className="text-white/80">{error}</p>
            <p className="text-white/60">Redirecting you back...</p>
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
