
export interface BotCommandResponse {
  success: boolean;
  [key: string]: any;
}

export interface CommandParams {
  guildId?: string;
  limit?: number;
  transferId?: string;
  roleId?: string;
  serverId?: string;
  amount?: number;
}

export interface CommandHistoryEntry {
  id: string;
  command: string;
  timestamp: Date;
  success: boolean;
  result: any;
  favorite?: boolean;
}
