
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBot } from '@/context/BotContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Shield } from 'lucide-react';
import { ServerSelector } from './server-info/ServerSelector';
import { ChannelsTab } from './server-info/ChannelsTab';
import { RolesTab } from './server-info/RolesTab';
import { MembersTab } from './server-info/MembersTab';

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
          <ServerSelector
            selectedGuild={selectedGuild}
            setSelectedGuild={setSelectedGuild}
            guilds={guilds}
            loading={loading.guilds}
          />
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
              <ChannelsTab channels={channels} loading={loading.channels} />
            </TabsContent>
            
            <TabsContent value="roles" className="mt-4">
              <RolesTab roles={roles} loading={loading.roles} />
            </TabsContent>
            
            <TabsContent value="members" className="mt-4">
              <MembersTab members={members} loading={loading.members} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
