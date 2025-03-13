
import React, { useState } from 'react';
import { useBot } from '@/context/BotContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Webhook, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface WebhooksTabProps {
  guildId: string;
  channelId: string | null;
  loading: boolean;
}

export const WebhooksTab: React.FC<WebhooksTabProps> = ({ 
  guildId, 
  channelId, 
  loading 
}) => {
  const { handleWebhookRegistration } = useBot();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [webhookData, setWebhookData] = useState<{id: string, token: string} | null>(null);

  const registerWebhook = async () => {
    if (!channelId) {
      toast.error('Please select a channel first');
      return;
    }
    
    setIsRegistering(true);
    try {
      const result = await handleWebhookRegistration(guildId, channelId);
      setWebhookData(result);
      setShowIntegrationDialog(true);
    } catch (error) {
      // Error handling is already in the context function
    } finally {
      setIsRegistering(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return <div className="text-center py-4">Loading webhooks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-background/50 p-4 rounded-md space-y-3">
        <div className="flex flex-col space-y-1">
          <h3 className="text-sm font-medium">Discord Integration</h3>
          <p className="text-xs text-muted-foreground">
            Connect your bot to receive commands directly from your Discord server
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={registerWebhook} 
            disabled={isRegistering || !channelId}
            className="w-full sm:w-auto"
          >
            {isRegistering ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Register Webhook
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Discord Commands</h4>
        <div className="bg-muted p-3 rounded-md text-xs font-mono">
          <p className="mb-1">Use these commands in your Discord server:</p>
          <div className="pl-2 border-l-2 border-primary/30 space-y-1">
            <p>!swapper help - Show available commands</p>
            <p>!swapper status - Check bot status</p>
            <p>!swapper stats - Show server statistics</p>
            <p>!swapper join &lt;server_id&gt; &lt;amount&gt; - Start a transfer</p>
          </div>
        </div>
      </div>
      
      {/* Webhook Integration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Webhook Integration Complete</DialogTitle>
            <DialogDescription>
              Your Discord server is now connected. Use these details to customize the integration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="webhook-id">Webhook ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="webhook-id" 
                  readOnly 
                  value={webhookData?.id || ''} 
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(webhookData?.id || '')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="webhook-token">Webhook Token</Label>
              <div className="flex gap-2">
                <Input 
                  id="webhook-token" 
                  readOnly 
                  value={webhookData?.token || ''} 
                  type="password" 
                  className="font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(webhookData?.token || '')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md text-xs space-y-2">
              <p className="font-medium">Important Security Note:</p>
              <p>Keep your webhook token secret! Anyone with this token can post messages to your channel.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIntegrationDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
