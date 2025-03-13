
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, ExternalLink, Heart, HelpCircle, Info, Mail, MessageCircle, Server, Shield, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import guideContent from '@/docs/DiscordBotGuide.md?raw';

interface DocumentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  open,
  onOpenChange
}) => {
  // Ensure the scroll position resets when the modal opens
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChange(false);
  };

  // Force the modal to be in the foreground when open
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-400" />
            Discord Bot Documentation
          </DialogTitle>
          <DialogDescription>
            Complete guide to setting up and using the Discord bot integration
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="prose prose-invert prose-headings:mt-6 prose-headings:mb-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-3 prose-li:my-1 prose-table:my-4 max-w-none">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-discord-dark p-6 rounded-lg w-full max-w-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white m-0">Discord Bot Integration</h2>
                    <p className="text-discord-gray m-0">Your gateway to Discord server management</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-discord-darker p-3 rounded flex flex-col items-center">
                    <Server className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-center">Server Management</span>
                  </div>
                  <div className="bg-discord-darker p-3 rounded flex flex-col items-center">
                    <Users className="h-8 w-8 text-green-400 mb-2" />
                    <span className="text-sm text-center">User Analytics</span>
                  </div>
                  <div className="bg-discord-darker p-3 rounded flex flex-col items-center">
                    <Shield className="h-8 w-8 text-yellow-400 mb-2" />
                    <span className="text-sm text-center">Security Features</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    {props.children}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 border border-gray-700 rounded-md">
                    <table {...props} className="min-w-full divide-y divide-gray-700" />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead {...props} className="bg-gray-800" />
                ),
                th: ({ node, ...props }) => (
                  <th {...props} className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider" />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="px-4 py-3 text-sm border-t border-gray-700" />
                ),
                tr: ({ node, ...props }) => (
                  <tr {...props} className="hover:bg-gray-750" />
                ),
                code: ({ node, ...props }) => (
                  <code {...props} className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" />
                ),
                pre: ({ node, ...props }) => (
                  <pre {...props} className="bg-gray-800 p-4 rounded-md overflow-x-auto text-sm" />
                ),
                h2: ({ node, ...props }) => (
                  <div className="border-l-4 border-primary pl-4 my-8">
                    <h2 {...props} className="text-2xl font-bold mt-0" />
                  </div>
                ),
                img: ({ node, ...props }) => (
                  <div className="flex justify-center my-6">
                    <img
                      {...props}
                      className="rounded-lg shadow-lg max-w-full border border-gray-700"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                ),
                // Special styling for Support and Credits sections
                h3: ({ node, children, ...props }) => {
                  const headingText = String(children).toLowerCase();
                  if (headingText.includes('support')) {
                    return (
                      <h3 {...props} className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-green-400" />
                        {children}
                      </h3>
                    );
                  } else if (headingText.includes('credits')) {
                    return (
                      <h3 {...props} className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-400" />
                        {children}
                      </h3>
                    );
                  } else {
                    return <h3 {...props} className="text-xl font-bold mt-6 mb-4">{children}</h3>;
                  }
                },
              }}
            >
              {guideContent}
            </ReactMarkdown>
            
            <div className="mt-8 p-6 bg-discord-darker rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Info className="h-5 w-5 text-blue-400 mr-2" />
                Getting Started Checklist
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-green-500/20 p-1 rounded-full mr-2 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Register application in Discord Developer Portal</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-500/20 p-1 rounded-full mr-2 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Create bot and copy token</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-500/20 p-1 rounded-full mr-2 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Enable required intents</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-500/20 p-1 rounded-full mr-2 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Invite bot to your server</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-500/20 p-1 rounded-full mr-2 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Connect bot token in this application</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-lg border border-green-700">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-400" />
                  Need Support?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-green-300 font-medium">Email Support</p>
                      <p className="text-sm">support@discordbot-manager.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-green-300 font-medium">Discord Community</p>
                      <p className="text-sm">Join our server for live assistance</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-lg border border-yellow-700">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Credits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Heart className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-300 font-medium">Created with ♥ by</p>
                      <p className="text-sm">DiscordTools Inc.</p>
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    <p>© 2024 DiscordTools Inc. All rights reserved.<br/>Version 2.0.3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-2 border-t border-gray-700">
          <Button variant="outline" onClick={handleCloseModal}>
            Close Documentation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
