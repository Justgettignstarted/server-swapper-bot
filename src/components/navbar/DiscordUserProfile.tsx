import React from 'react';
import { User, ExternalLink, Diamond, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  getDiscordUser,
  getDiscordAvatarUrl,
  getDiscordBannerUrl,
  getDiscordPremiumBadge,
  formatDiscordUsername
} from '@/utils/auth/discordAuth';

interface DiscordUserProfileProps {
  username?: string;
  isPremium?: boolean;
  premiumTier?: string;
}

export const DiscordUserProfile: React.FC<DiscordUserProfileProps> = ({
  username,
  isPremium = false,
  premiumTier = 'Pro'
}) => {
  // Get Discord user info
  const discordUser = getDiscordUser();
  const avatarUrl = getDiscordAvatarUrl(discordUser);
  const bannerUrl = getDiscordBannerUrl(discordUser);
  const nitroStatus = getDiscordPremiumBadge(discordUser);
  
  // Get the formatted display name instead of using the passed username prop
  const displayUsername = discordUser ? formatDiscordUsername(discordUser) : username;

  // Determine badge appearance based on tier
  const getBadgeStyles = () => {
    switch (premiumTier) {
      case 'Enterprise':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
          border: 'border-amber-500/20',
          icon: <Crown className="h-3 w-3" />
        };
      case 'Pro':
      default:
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-500',
          border: 'border-purple-500/20',
          icon: <Diamond className="h-3 w-3" />
        };
    }
  };

  // Format Discord username for display
  const formatDiscordUsernameDisplay = (discordName: string | undefined) => {
    if (!discordName) return null;
    
    if (discordName && discordName.includes('#')) {
      const [name, discriminator] = discordName.split('#');
      return (
        <>
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-discord-blurple">#{discriminator}</span>
        </>
      );
    }
    return <span className="text-sm font-medium">{discordName}</span>;
  };

  const badgeStyles = getBadgeStyles();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 bg-discord-darker/30 px-3 py-1.5 rounded-md cursor-pointer">
          <Avatar className="h-7 w-7 border-2 border-discord-blurple/30">
            <AvatarImage src={avatarUrl} alt={displayUsername || 'User'} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          
          <div className="flex items-center">
            {formatDiscordUsernameDisplay(displayUsername)}
          </div>
          
          {isPremium && (
            <Badge 
              variant="outline" 
              className={`ml-1 ${badgeStyles.bg} ${badgeStyles.text} ${badgeStyles.border} px-2 py-0 flex items-center gap-1`}
            >
              {badgeStyles.icon}
              <span className="text-xs">{premiumTier?.toUpperCase()}</span>
            </Badge>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 bg-discord-darker/90 border-discord-blurple/20 text-white">
        <div className="relative">
          {bannerUrl && (
            <div className="h-24 w-full overflow-hidden rounded-t-md">
              <img 
                src={bannerUrl} 
                alt="User Banner" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`p-4 ${bannerUrl ? 'pt-2' : ''}`}>
            <div className="flex items-start gap-3">
              <Avatar className={`h-16 w-16 border-4 border-discord-darker ${bannerUrl ? '-mt-8' : ''}`}>
                <AvatarImage src={avatarUrl} alt={displayUsername || 'User'} />
                <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{discordUser?.global_name || discordUser?.username || 'Discord User'}</h3>
                    {discordUser?.global_name && discordUser?.username && (
                      <p className="text-xs text-gray-400">@{discordUser?.username}</p>
                    )}
                  </div>
                  
                  {discordUser?.id && (
                    <a 
                      href={`https://discord.com/users/${discordUser.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {nitroStatus && (
                    <Badge variant="secondary" className="bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30">
                      {nitroStatus}
                    </Badge>
                  )}
                  
                  {discordUser?.accent_color && (
                    <Badge 
                      variant="outline" 
                      className="border-gray-700"
                      style={{ backgroundColor: `#${discordUser.accent_color.toString(16).padStart(6, '0')}20` }}
                    >
                      Accent Color
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
