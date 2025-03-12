
/**
 * Discord Bot types and interfaces
 */

// Define the connection status type
export type BotConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BotStatus {
  status: BotConnectionStatus;
  error: string | null;
  lastChecked: Date | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  memberCount?: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

export interface DiscordMember {
  id: string;
  username: string;
  avatar: string | null;
  roles: string[];
}
