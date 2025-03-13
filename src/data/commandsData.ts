
export interface CommandData {
  command: string;
  description: string;
  example: string;
}

export const commands: CommandData[] = [
  {
    command: "-test",
    description: "Check if bot is online",
    example: "-test"
  },
  {
    command: "-authorized",
    description: "Get the amount of users",
    example: "-authorized"
  },
  {
    command: "-progress",
    description: "See the progress so far",
    example: "-progress"
  },
  {
    command: "-join",
    description: "Join users to server",
    example: "-join <gid> <amt>"
  },
  {
    command: "-refreshtokens",
    description: "Refresh tokens",
    example: "-refreshtokens"
  },
  {
    command: "-set",
    description: "Sets the role once verified",
    example: "-set <roleid> <serverid>"
  },
  {
    command: "-getGuilds",
    description: "List all available servers",
    example: "-getGuilds"
  },
  {
    command: "-getChannels",
    description: "List all channels in a server",
    example: "-getChannels <guildId>"
  },
  {
    command: "-getRoles",
    description: "List all roles in a server",
    example: "-getRoles <guildId>"
  },
  {
    command: "-getMembers",
    description: "List members in a server",
    example: "-getMembers <guildId> <limit>"
  }
];
