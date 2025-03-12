
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const DiscordCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get the code from the URL
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        setError(error);
        toast.error(`Authentication failed: ${error}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      if (!code) {
        setError('No authorization code received');
        toast.error('Authentication failed: No code received');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // In a real application, you would exchange this code for a token via a backend
        // For this demo, we'll simulate a successful authentication
        console.log('Received Discord OAuth code:', code);
        
        // Simulate successful authentication (in production this would be a real API call)
        const mockDiscordUserData = {
          id: '123456789012345678',
          username: 'DiscordUser',
          discriminator: '1234',
          avatar: null,
          email: 'user@example.com'
        };
        
        // Store the user data
        localStorage.setItem('discordUser', JSON.stringify(mockDiscordUserData));
        localStorage.setItem('username', `${mockDiscordUserData.username}#${mockDiscordUserData.discriminator}`);
        
        toast.success(`Welcome, ${mockDiscordUserData.username}!`);
        
        // Redirect back to the home page
        navigate('/');
      } catch (err) {
        console.error('Error processing Discord callback:', err);
        setError('Failed to complete authentication');
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
            <p className="text-white/80">{error}</p>
            <p className="text-white/60">Redirecting you back...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-discord-blurple" />
            <h2 className="text-2xl font-bold text-white">Authenticating with Discord</h2>
            <p className="text-white/80">Please wait while we complete the authentication process...</p>
          </div>
        )}
      </div>
    </div>
  );
};
