import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageTransition from '@/components/layout/PageTransition';
import MessageThread from '@/components/dashboard/MessageThread';
import NewMessageDialog from '@/components/messages/NewMessageDialog';
import { useAuth } from '@/context/AuthContext';
import { Message, getMessagesByUser, getUserById, getProjectById } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const allMessages = user ? getMessagesByUser(user.id) : [];
  
  useEffect(() => {
    if (user) {
      setMessages(allMessages);
    }
  }, [allMessages, user]);
  
  const conversations = React.useMemo(() => {
    const conversationMap = new Map<string, Message[]>();
    
    messages.forEach(message => {
      if (message.projectId) {
        const key = `project-${message.projectId}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)?.push(message);
      } 
      else if (message.recipientId) {
        const otherUserId = message.senderId === user?.id ? message.recipientId : message.senderId;
        const key = `user-${otherUserId}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)?.push(message);
      }
    });
    
    return Array.from(conversationMap.entries())
      .map(([key, messages]) => {
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
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
          subtitle = otherUser?.role === 'client' ? 'Client' : 
                    otherUser?.role === 'admin' ? 'Admin' :
                    otherUser?.role === 'project_manager' ? 'Project Manager' : 'Team Member';
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
  }, [messages, user?.id]);
  
  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeMessages = activeConversation 
    ? conversations.find(c => c.id === activeConversation)?.messages || []
    : [];
  
  React.useEffect(() => {
    if (activeConversation) {
      setMessages(prev => 
        prev.map(msg => {
          if (activeConversation.startsWith('user-')) {
            const userId = activeConversation.replace('user-', '');
            if (msg.senderId === userId && msg.recipientId === user?.id && !msg.read) {
              return { ...msg, read: true };
            }
          }
          return msg;
        })
      );
      
      console.log(`Marking messages in ${activeConversation} as read`);
    }
  }, [activeConversation, user?.id]);
  
  const handleNewConversation = (recipientId: string) => {
    navigate(`/client-message/${recipientId}`);
  };
  
  const handleSendMessage = (content: string) => {
    if (!activeConversation || !user) return;
    
    const newMessageId = `msg_${Date.now()}`;
    
    let recipientId = '';
    let projectId = null;
    
    if (activeConversation.startsWith('user-')) {
      recipientId = activeConversation.replace('user-', '');
    } else if (activeConversation.startsWith('project-')) {
      projectId = activeConversation.replace('project-', '');
      return;
    }
    
    const newMessage: Message = {
      id: newMessageId,
      content,
      senderId: user.id,
      recipientId,
      timestamp: new Date().toISOString(),
      read: false,
      projectId,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    createMessageNotification(user.id, recipientId, content.substring(0, 30));
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered"
    });
    
    console.log('New message created:', newMessage);
  };
  
  const activeConversationDetails = activeConversation 
    ? conversations.find(c => c.id === activeConversation)
    : null;

  const handleConversationClick = (conversation: any) => {
    if (conversation.id.startsWith('user-')) {
      const userId = conversation.id.replace('user-', '');
      navigate(`/client-message/${userId}`);
    } else {
      setActiveConversation(conversation.id);
    }
  };

  const createMessageNotification = (senderId: string, recipientId: string, messagePreview: string) => {
    const sender = getUserById(senderId);
    if (!sender || !recipientId) return;
    
    const notificationId = `notif_${Date.now()}`;
    
    const { notifications } = require('@/data/notificationData');
    notifications.push({
      id: notificationId,
      userId: recipientId,
      type: 'message' as const,
      title: 'New Message',
      content: `${sender.name} sent you a message: "${messagePreview}"`,
      link: '/messages',
      read: false,
      createdAt: new Date(),
    });
  };

  return (
    <PageTransition className="h-[calc(100vh-4rem)]">
      <div className="grid h-full" style={{ gridTemplateColumns: '300px 1fr' }}>
        <aside className="border-r h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <NewMessageDialog onSelectRecipient={handleNewConversation} />
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
                  onClick={() => handleConversationClick(conversation)}
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
                  Choose a conversation from the sidebar or start a new one
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
