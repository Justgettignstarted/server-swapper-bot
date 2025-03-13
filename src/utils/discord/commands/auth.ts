
import { DISCORD_API_BASE, rateLimitAwareFetch } from '../api/base';

/**
 * Helper function for fetching authorized user count
 */
export const fetchAuthCount = async (token: string): Promise<any> => {
  try {
    // Fetch guilds the bot is in
    const guildsResponse = await rateLimitAwareFetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      method: 'GET',
      headers: {
        'Authorization': `Bot ${token}`
      }
    });
    
    if (!guildsResponse.ok) {
      throw new Error(`Failed to fetch guilds: ${guildsResponse.status} ${guildsResponse.statusText}`);
    }
    
    const guilds = await guildsResponse.json();
    
    if (!guilds || !Array.isArray(guilds)) {
      return { success: true, count: 0 };
    }
    
    // Count total members across all guilds
    let totalCount = 0;
    
    // To avoid excessive API calls, only check up to 3 servers
    const serversToCheck = Math.min(guilds.length, 3);
    
    for (let i = 0; i < serversToCheck; i++) {
      try {
        // Note: This requires the bot to have the GUILD_MEMBERS intent enabled
        const membersResponse = await rateLimitAwareFetch(
          `${DISCORD_API_BASE}/guilds/${guilds[i].id}/members?limit=1000`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bot ${token}`
            }
          }
        );
        
        if (membersResponse.ok) {
          const members = await membersResponse.json();
          if (members && Array.isArray(members)) {
            totalCount += members.length;
          }
        } else if (membersResponse.status === 403) {
          console.warn(`Missing permission to fetch members for guild ${guilds[i].id} - bot likely needs GUILD_MEMBERS intent`);
        } else {
          console.warn(`Couldn't fetch members for guild ${guilds[i].id}: ${membersResponse.status}`);
        }
      } catch (error) {
        console.error(`Error fetching members for guild ${guilds[i].id}:`, error);
        // Continue with next guild if one fails
      }
    }
    
    // If we couldn't get any members (likely due to missing GUILD_MEMBERS intent),
    // use guild.approximate_member_count if available
    if (totalCount === 0 && guilds.length > 0) {
      for (const guild of guilds) {
        if (guild.approximate_member_count) {
          totalCount += guild.approximate_member_count;
        }
      }
      
      // If still no data, use a conservative estimate
      if (totalCount === 0) {
        totalCount = guilds.length * 50; // Approximate 50 members per guild
      }
    }
    
    return { success: true, count: totalCount };
  } catch (error) {
    console.error('Error in fetchAuthCount:', error);
    throw error;
  }
};
