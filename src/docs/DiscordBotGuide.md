
# Discord Bot Integration Guide

This guide explains how our Discord bot integration works and what you need to set up to use it properly.

![Discord Developer Portal](/discord-developer-portal.png)

## Overview

The Discord bot integration allows you to:
- Connect your Discord bot to this application
- Monitor and manage your Discord servers
- Execute various commands to interact with Discord servers
- View statistics about servers, users, and activities

## Requirements

To use this integration, you'll need:

1. **A Discord Bot Token**
   - Register an application in the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot for your application
   - Generate and copy your bot token
   - Enable the required intents (see below)

2. **Required Bot Permissions and Intents**
   - **OAuth2 Scopes:**
     - `bot` scope
     - `applications.commands` scope
   - **Bot Permissions:**
     - `Read Messages/View Channels`
     - `Send Messages`
     - `Manage Roles` (for role assignment)
     - `Create Instant Invite`
   - **Required Intents** (in Bot settings):
     - Server Members Intent (crucial for member operations)
     - Message Content Intent (for command processing)
     - Presence Intent (optional, for enhanced user status monitoring)

![Discord Bot Permissions](/discord-bot-permissions.png)

3. **Bot Must Be In Your Servers**
   - Your bot must be invited to any Discord servers you want to manage
   - Use the OAuth2 URL Generator in the Discord Developer Portal with the necessary permissions
   - The invitation link should include all the required scopes and permissions

## Connection Process

### Setting Up Your Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and provide a name
3. Navigate to the "Bot" tab and click "Add Bot"
4. Under the "Privileged Gateway Intents" section, enable:
   - Server Members Intent
   - Message Content Intent
5. Click "Reset Token" to generate a new token (or copy your existing one)
6. Save this token securely - you'll need it for this application

![Discord Bot Setup](/discord-bot-setup.png)

### Connecting Your Bot

1. Enter your Discord bot token in the Bot Connection Setup panel
2. The application securely stores this token in your browser's localStorage
3. Click "Connect Bot" to establish the connection
4. The application will verify the connection and show the bot's status
5. Once connected, you'll see "Online" status indicator and server statistics

## Dashboard Statistics

The dashboard displays real-time statistics pulled directly from Discord's API:

- **Authorized Users**: The total number of users across your Discord servers
- **Servers**: The number of Discord servers your bot is a member of
- **Transfers Completed**: Number of successful user transfers (if applicable)
- **Verification Rate**: Success rate of verification processes (if applicable)

These statistics are refreshed automatically and can be manually updated using the "Refresh Stats" button.

![Discord Dashboard](/discord-dashboard.png)

## Command Reference

This application provides a user interface for interacting with Discord through these commands:

| Command | Description | Parameters |
|---------|-------------|------------|
| `-test` | Checks if bot is online | None |
| `-authorized` | Gets the number of authorized users | None |
| `-progress` | Shows transfer progress statistics | None |
| `-join` | Facilitates user joining process | `<server_id> <amount>` |
| `-refreshtokens` | Refreshes user tokens | None |
| `-set` | Sets role for verified users | `<role_id> <server_id>` |
| `-getGuilds` | Lists all available servers | None |
| `-getChannels` | Lists all channels in a server | `<guild_id>` |
| `-getRoles` | Lists all roles in a server | `<guild_id>` |
| `-getMembers` | Lists members in a server | `<guild_id> <limit>` |

## Server Management Features

### Server Information Panel

The Server Information panel allows you to:

1. View a list of all servers (guilds) your bot is connected to
2. See detailed information about each server:
   - Channels (text, voice, announcement, etc.)
   - Roles and their permissions
   - Member counts and details (limited by Discord API constraints)

To use this panel:
1. Navigate to the "Server Information" tab
2. Select a server from the dropdown
3. Choose what information you want to view (channels, roles, members)
4. The information will be displayed in a structured format

![Server Information Panel](/server-info-panel.png)

### User Management Functions

For managing users across servers:

1. Navigate to the "User Transfer" tab
2. Enter the destination server ID
3. Specify parameters for the operation
4. Monitor progress in the dashboard

## Technical Implementation Details

### API Rate Limits

Discord imposes strict rate limits on API requests:

- The application includes built-in rate limit handling
- If you encounter "Rate limited" messages, the system will automatically retry
- For large servers, some operations may take longer due to these limits

### Security Considerations

- Your bot token provides full access to your bot - treat it like a password
- This application stores your token only in your browser's localStorage
- The token is used only for direct API calls to Discord
- Clear the token when finished by clicking "Clear Token"
- No server-side storage of your token occurs

![Security Diagram](/security-diagram.png)

### Error Handling

Common error scenarios and solutions:

1. **"Bot is offline" or connection failures:**
   - Verify your token is correct and not expired
   - Check if the bot application is enabled in Discord Developer Portal
   - Ensure all required intents are enabled

2. **"Failed to fetch" errors:**
   - These typically indicate permission issues
   - Verify your bot has the necessary permissions in the servers
   - Some operations require specific intents to be enabled

3. **Limited or no members shown:**
   - This is normal for larger servers due to Discord API limitations
   - The Server Members Intent must be enabled
   - Discord limits how many members can be fetched at once

## Additional Resources

- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Discord Bot Permissions Calculator](https://discordapi.com/permissions.html)
- [Discord API Rate Limits](https://discord.com/developers/docs/topics/rate-limits)

## Troubleshooting

If you encounter issues:

1. Check the bot's connection status at the top of the dashboard
2. Use the "Refresh Connection" button to re-establish the connection
3. Try the `-test` command to verify bot functionality
4. Check browser console logs for detailed error messages
5. Ensure your bot has the necessary permissions in your Discord servers
6. Verify that all required intents are enabled in the Discord Developer Portal
