
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageTransition from '@/components/layout/PageTransition';
import MessageThread from '@/components/dashboard/MessageThread';
import { useAuth } from '@/context/AuthContext';
import { Message, getMessagesByUser, getUserById, getProjectById } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Messages = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get user messages
  const allMessages = user ? getMessagesByUser(user.id) : [];
  
  // Group messages by conversation
  const conversations = React.useMemo(() => {
    const conversationMap = new Map<string, Message[]>();
    
    allMessages.forEach(message => {
      // For project messages
      if (message.projectId) {
        const key = `project-${message.projectId}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)?.push(message);
      } 
      // For direct messages
      else if (message.recipientId) {
        const otherUserId = message.senderId === user?.id ? message.recipientId : message.senderId;
        const key = `user-${otherUserId}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)?.push(message);
      }
    });
    
    // Convert map to array and sort by latest message
    return Array.from(conversationMap.entries())
      .map(([key, messages]) => {
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Extract conversation details
        let title = '';
        let avatar = '';
        let subtitle = '';
        
        if (key.startsWith('project-')) {
          const projectId = key.replace('project-', '');
          const project = getProjectById(projectId);
          title = project?.name || 'Unknown Project';
          subtitle = 'Project Chat';
        } else if (key.startsWith('user-')) {
          const userId = key.replace('user-', '');
          const otherUser = getUserById(userId);
          title = otherUser?.name || 'Unknown User';
          avatar = otherUser?.avatar || '';
          subtitle = otherUser?.role === 'client' ? 'Client' : 'Team Member';
        }
        
        return {
          id: key,
          title,
          avatar,
          subtitle,
          latestMessage: sortedMessages[0],
          unreadCount: sortedMessages.filter(m => m.recipientId === user?.id && !m.read).length,
          messages: sortedMessages,
        };
      })
      .sort((a, b) => new Date(b.latestMessage.timestamp).getTime() - new Date(a.latestMessage.timestamp).getTime());
  }, [allMessages, user?.id]);
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get active conversation messages
  const activeMessages = activeConversation 
    ? conversations.find(c => c.id === activeConversation)?.messages || []
    : [];
  
  // Mark messages as read (in a real app, this would update the backend)
  React.useEffect(() => {
    if (activeConversation) {
      // This would be an API call in a real app
      console.log(`Marking messages in ${activeConversation} as read`);
    }
  }, [activeConversation]);
  
  // Send message function (would connect to backend in real app)
  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
    // In a real app, this would send the message to the backend
  };
  
  // Get active conversation details
  const activeConversationDetails = activeConversation 
    ? conversations.find(c => c.id === activeConversation)
    : null;

  return (
    <PageTransition className="h-[calc(100vh-4rem)]">
      <div className="grid h-full" style={{ gridTemplateColumns: '300px 1fr' }}>
        {/* Sidebar with conversation list */}
        <aside className="border-r h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="divide-y">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-3 cursor-pointer transition-colors",
                    activeConversation === conversation.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 mt-0.5">
                      <AvatarImage src={conversation.avatar} alt={conversation.title} />
                      <AvatarFallback>
                        {conversation.id.startsWith('project-') ? 'P' : conversation.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium truncate">{conversation.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conversation.latestMessage.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-baseline mt-1">
                        <div className="text-sm text-muted-foreground truncate">
                          {conversation.latestMessage.senderId === user?.id ? 'You: ' : ''}
                          {conversation.latestMessage.content}
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
        
        {/* Main message area */}
        <main className="flex flex-col h-full">
          {activeConversationDetails ? (
            <>
              <header className="flex items-center p-4 h-16 border-b">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={activeConversationDetails.avatar} alt={activeConversationDetails.title} />
                  <AvatarFallback>
                    {activeConversationDetails.id.startsWith('project-') ? 'P' : activeConversationDetails.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{activeConversationDetails.title}</h2>
                  <p className="text-xs text-muted-foreground">{activeConversationDetails.subtitle}</p>
                </div>
              </header>
              
              <div className="flex-grow">
                <MessageThread
                  messages={activeMessages}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-muted/50">
              <div className="max-w-md">
                <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default Messages;
