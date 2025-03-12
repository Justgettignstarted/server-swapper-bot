
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
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
 * Format a Discord username (handles both old and new format)
 */
export const formatDiscordUsername = (user: DiscordUser | null): string => {
  if (!user) return '';
  
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
