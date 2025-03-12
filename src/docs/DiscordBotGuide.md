
# Discord Bot Integration Guide

This guide explains how our Discord bot integration works and what you need to set up to use it properly.

## Overview

The Discord bot integration allows you to:
- Connect your Discord bot to this application
- Manage user transfers between Discord servers
- Execute various commands to interact with Discord servers
- View statistics about authorized users and transfers

## Requirements

To use this integration, you'll need:

1. **A Discord Bot Token**
   - You must register an application in the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot for your application
   - Generate and copy your bot token
   - Give the bot proper permissions (see below)

2. **Required Bot Permissions**
   - `bot` scope
   - `applications.commands` scope
   - `Read Messages/View Channels` permission
   - `Send Messages` permission
   - `Manage Roles` permission (for role assignment)
   - `Create Instant Invite` permission
   - Server Members Intent (in Bot settings)
   - Message Content Intent (in Bot settings)

3. **Bot Must Be In Servers**
   - Your bot must be invited to the Discord servers you want to manage
   - Use the OAuth2 URL Generator in the Discord Developer Portal to create an invite link with the necessary permissions

## How It Works

### Bot Connection

1. Enter your Discord bot token in the Bot Connection Setup panel
2. The application securely stores this token in your browser's localStorage
3. The token is used to authenticate API requests to Discord
4. The application periodically checks the bot's connection status

### Dashboard Statistics

When connected, the dashboard displays:
- **Authorized Users**: Number of users authorized for transfers
- **Servers**: Number of Discord servers the bot is a member of
- **Transfers Completed**: Number of successful user transfers
- **Verification Rate**: Percentage of successful transfers out of total attempts

### Available Commands

The application provides a UI for these commands:

| Command | Description | Parameters |
|---------|-------------|------------|
| `-test` | Checks if bot is online | None |
| `-authorized` | Gets the number of authorized users | None |
| `-progress` | Shows transfer progress statistics | None |
| `-join` | Joins users to a server | `<server_id> <amount>` |
| `-refreshtokens` | Refreshes user tokens | None |
| `-set` | Sets role for verified users | `<role_id> <server_id>` |
| `-getGuilds` | Lists all available servers | None |
| `-getChannels` | Lists all channels in a server | `<guild_id>` |
| `-getRoles` | Lists all roles in a server | `<guild_id>` |
| `-getMembers` | Lists members in a server | `<guild_id> <limit>` |

### User Transfer Process

1. Navigate to the User Transfer tab
2. Enter the destination server ID
3. Specify the number of users to transfer
4. Click "Start Transfer"
5. The application will initiate the transfer and display a progress bar
6. Once complete, a success notification will appear

## Security Considerations

- Your bot token provides access to your bot - never share it publicly
- The token is stored only in your browser's localStorage
- The application makes direct API calls to Discord without sending your token to our servers
- Clear the token when no longer needed by clicking "Clear Token"

## Troubleshooting

If you encounter issues:

1. **Bot shows as "Offline"**
   - Verify your token is correct
   - Ensure the bot application is not disabled in Discord Developer Portal
   - Check that the bot has the required permissions and intents

2. **Cannot fetch servers**
   - Ensure the bot has the Server Members Intent enabled
   - Check that the bot is actually a member of the servers

3. **Cannot transfer users**
   - Verify the bot has proper permissions in both source and destination servers
   - Ensure the destination server ID is correct
   - Check that users have authorized the transfer

4. **Role assignment fails**
   - Ensure the bot's role is higher in the hierarchy than the role it's trying to assign
   - Verify that the role ID is correct

## Technical Implementation

This integration consists of the following main components:

1. **BotContext**: React context for managing bot state and operations
2. **API Module**: Handles direct communication with Discord's API
3. **Commands Module**: Processes and executes bot commands
4. **UI Components**: Dashboard, server info panel, and transfer section

For developers extending this functionality, refer to the Discord API documentation and our codebase for implementation details.
