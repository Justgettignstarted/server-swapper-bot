
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink } from 'lucide-react';
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Discord Bot Documentation</DialogTitle>
          <DialogDescription>
            Complete guide to setting up and using the Discord bot integration
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="prose prose-invert prose-headings:mt-6 prose-headings:mb-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-3 prose-li:my-1 prose-table:my-4 max-w-none">
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
              }}
            >
              {guideContent}
            </ReactMarkdown>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-2 border-t border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Documentation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
