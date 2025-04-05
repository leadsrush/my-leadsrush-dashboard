
import React, { useState, useRef, useEffect } from 'react';
import { Send, PaperclipIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Message, getUserById } from '@/data/mockData';
import { format } from 'date-fns';

interface MessageThreadProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || files.length > 0) {
      // In a real app, we would upload files and send their references
      const fileList = files.length > 0 
        ? `\n[Attached ${files.length} file${files.length > 1 ? 's' : ''}]` 
        : '';
        
      onSendMessage(newMessage + fileList);
      setNewMessage('');
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const sender = getUserById(message.senderId);
            const isCurrentUser = sender?.id === user?.id;
            const formattedTime = format(new Date(message.timestamp), 'MMM d, h:mm a');

            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender?.avatar} alt={sender?.name} />
                    <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div 
                      className={`rounded-lg p-3 ${
                        isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* File attachments area */}
      {files.length > 0 && (
        <div className="border-t p-3">
          <p className="text-sm text-muted-foreground mb-2">Attachments:</p>
          <ul className="flex flex-wrap gap-2">
            {files.map((file) => (
              <li key={file.name} className="flex items-center bg-muted/50 p-2 rounded-md text-sm">
                <PaperclipIcon className="h-3 w-3 mr-1" />
                <span className="max-w-[100px] truncate">{file.name}</span>
                <button 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFile(file.name)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-10 resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="icon" asChild className="relative">
              <label>
                <PaperclipIcon className="h-4 w-4" />
                <input 
                  type="file" 
                  multiple 
                  className="sr-only" 
                  onChange={handleFileChange}
                />
              </label>
            </Button>
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
