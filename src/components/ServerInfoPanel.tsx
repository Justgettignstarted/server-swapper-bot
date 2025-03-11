
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Server, MessageSquare, Users, Shield } from 'lucide-react';

export const ServerInfoPanel = () => {
  const { isConnected, fetchGuilds, fetchChannels, fetchRoles, fetchMembers } = useBot();
  const [guilds, setGuilds] = useState<any[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>('');
  const [channels, setChannels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    guilds: false,
    channels: false,
    roles: false,
    members: false
  });

  // Fetch guilds when component mounts if connected
  useEffect(() => {
    if (isConnected) {
      loadGuilds();
    }
  }, [isConnected]);

  // Fetch guild details when a guild is selected
  useEffect(() => {
    if (selectedGuild) {
      loadChannels(selectedGuild);
      loadRoles(selectedGuild);
      loadMembers(selectedGuild);
    }
  }, [selectedGuild]);

  const loadGuilds = async () => {
    setLoading(prev => ({ ...prev, guilds: true }));
    try {
      const guildsData = await fetchGuilds();
      setGuilds(guildsData);
      if (guildsData.length > 0) {
        setSelectedGuild(guildsData[0].id);
      }
    } catch (error) {
      console.error('Error loading guilds:', error);
    } finally {
      setLoading(prev => ({ ...prev, guilds: false }));
    }
  };

  const loadChannels = async (guildId: string) => {
    setLoading(prev => ({ ...prev, channels: true }));
    try {
      const channelsData = await fetchChannels(guildId);
      setChannels(channelsData);
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(prev => ({ ...prev, channels: false }));
    }
  };

  const loadRoles = async (guildId: string) => {
    setLoading(prev => ({ ...prev, roles: true }));
    try {
      const rolesData = await fetchRoles(guildId);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const loadMembers = async (guildId: string) => {
    setLoading(prev => ({ ...prev, members: true }));
    try {
      const membersData = await fetchMembers(guildId, 100);
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  const refreshData = () => {
    if (selectedGuild) {
      loadChannels(selectedGuild);
      loadRoles(selectedGuild);
      loadMembers(selectedGuild);
      toast.success('Server data refreshed');
    }
  };

  if (!isConnected) {
    return (
      <Card className="glass">
        <CardContent className="p-6 flex items-center justify-center">
          <p className="text-muted-foreground">
            Please connect your bot to view server information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Server Information</CardTitle>
            <Button variant="outline" size="sm" onClick={refreshData}>Refresh</Button>
          </div>
          <CardDescription>
            View information about your Discord servers
          </CardDescription>
          <div className="mt-4">
            <Select
              value={selectedGuild}
              onValueChange={setSelectedGuild}
              disabled={loading.guilds || guilds.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                {guilds.map(guild => (
                  <SelectItem key={guild.id} value={guild.id}>
                    {guild.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels">
            <TabsList className="w-full">
              <TabsTrigger value="channels" className="flex items-center gap-2 flex-1">
                <MessageSquare className="h-4 w-4" />
                Channels
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2 flex-1">
                <Shield className="h-4 w-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 flex-1">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="channels" className="mt-4">
              {loading.channels ? (
                <div className="text-center py-4">Loading channels...</div>
              ) : channels.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No channels found</div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {channels.map(channel => (
                    <div key={channel.id} className="p-2 rounded-md bg-background/50 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{channel.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : 'Other'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="roles" className="mt-4">
              {loading.roles ? (
                <div className="text-center py-4">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No roles found</div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {roles.map(role => (
                    <div key={role.id} className="p-2 rounded-md bg-background/50 flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: `#${role.color.toString(16).padStart(6, '0')}` }}
                      ></div>
                      <span className="text-sm">{role.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Position: {role.position}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="members" className="mt-4">
              {loading.members ? (
                <div className="text-center py-4">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No members found</div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {members.map(member => (
                    <div key={member.user?.id || member.id} className="p-2 rounded-md bg-background/50 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {member.user?.username || member.username || 'Unknown User'}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {member.roles?.length || 0} roles
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
