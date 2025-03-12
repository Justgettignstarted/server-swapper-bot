
import { DiscordChannel, DiscordGuild, DiscordMember, DiscordRole } from "@/utils/discord/types";

export interface LoadingState {
  guilds: boolean;
  channels: boolean;
  roles: boolean;
  members: boolean;
}

export type { DiscordChannel, DiscordGuild, DiscordMember, DiscordRole };
