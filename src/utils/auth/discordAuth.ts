
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  banner?: string | null;
  accent_color?: number | null;
  global_name?: string | null;
  banner_color?: string | null;
  public_flags?: number;
  premium_type?: number;
}

/**
 * Get the current authenticated Discord user from localStorage
 */
export const getDiscordUser = (): DiscordUser | null => {
  const userJson = localStorage.getItem('discordUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as DiscordUser;
  } catch (e) {
    console.error('Failed to parse Discord user data:', e);
    return null;
  }
};

/**
 * Get Discord avatar URL for a user
 */
export const getDiscordAvatarUrl = (user: DiscordUser | null): string => {
  if (!user || !user.avatar) {
    // Default Discord avatar based on discriminator
    const defaultNumber = user?.discriminator ? parseInt(user.discriminator) % 5 : 0;
    return `https://cdn.discordapp.com/embed/avatars/${defaultNumber}.png`;
  }
  
  // Format: https://cdn.discordapp.com/avatars/USER_ID/AVATAR_ID.png
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
};

/**
 * Get Discord banner URL for a user
 */
export const getDiscordBannerUrl = (user: DiscordUser | null): string | null => {
  if (!user || !user.banner) return null;
  
  // Format: https://cdn.discordapp.com/banners/USER_ID/BANNER_ID.png
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`;
};

/**
 * Format a Discord username (handles both old and new format)
 */
export const formatDiscordUsername = (user: DiscordUser | null): string => {
  if (!user) return '';
  
  // New Discord usernames use global_name as display name
  if (user.global_name) {
    return user.global_name;
  }
  
  // Handle both old format (username#discriminator) and new format
  if (user.discriminator && user.discriminator !== '0') {
    return `${user.username}#${user.discriminator}`;
  }
  
  return user.username;
};

/**
 * Clear Discord authentication data
 */
export const clearDiscordAuth = (): void => {
  localStorage.removeItem('discordUser');
  localStorage.removeItem('username');
  localStorage.removeItem('discordOAuthState');
};

/**
 * Check if user is authenticated with Discord
 */
export const isDiscordAuthenticated = (): boolean => {
  return getDiscordUser() !== null;
};

/**
 * Get Discord premium status badge name
 */
export const getDiscordPremiumBadge = (user: DiscordUser | null): string | null => {
  if (!user || !user.premium_type) return null;
  
  switch (user.premium_type) {
    case 1: return 'Nitro Classic';
    case 2: return 'Nitro';
    case 3: return 'Nitro Basic';
    default: return null;
  }
};
