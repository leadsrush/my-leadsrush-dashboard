
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, PaperclipIcon } from 'lucide-react';
import { getUserById, getMessagesByUser } from '@/data/mockData';
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const ClientMessage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const recipient = clientId ? getUserById(clientId) : null;
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [existingMessages, setExistingMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Redirect to messages page if trying to access directly without recipient
    if (!recipient || !user) {
      navigate('/messages');
      return;
    }

    // Load any existing messages between these users
    if (user) {
      const allMessages = getMessagesByUser(user.id);
      const relevantMessages = allMessages.filter(msg => 
        (msg.senderId === user.id && msg.recipientId === clientId) || 
        (msg.senderId === clientId && msg.recipientId === user.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setExistingMessages(relevantMessages);
    }
  }, [recipient, navigate, user, clientId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() && files.length === 0) {
      toast({
        title: "Cannot send empty message",
        description: "Please add a message or attach files",
        variant: "destructive"
      });
      return;
    }
    
    if (!user || !recipient) {
      toast({
        title: "Error",
        description: "Missing user or recipient information",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    // Create file attachments mention if files are present
    const fileAttachmentsText = files.length > 0 
      ? `\n[Attached ${files.length} file${files.length > 1 ? 's' : ''}]` 
      : '';
    
    // Create a new message object
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: message + fileAttachmentsText,
      senderId: user.id,
      recipientId: clientId,
      timestamp: new Date().toISOString(),
      read: false,
      projectId: null, // Fix: Add projectId property with null value
    };
    
    // In a real app, this would be an API call
    setTimeout(() => {
      console.log("Sending message to recipient:", clientId);
      console.log("Message:", newMessage);
      console.log("Files:", files);
      
      // Add the message to our local state
      setExistingMessages(prev => [...prev, newMessage]);
      
      toast({
        title: "Message sent successfully",
        description: "The recipient will receive your message in their dashboard"
      });
      
      // Create a notification for the recipient
      createMessageNotification(user.id, clientId, "New message");
      
      // Clear the form
      setMessage('');
      setFiles([]);
      setIsSending(false);
    }, 500);
  };
  
  if (!recipient) {
    return (
      <PageTransition>
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Recipient Not Found</h1>
          <Button variant="outline" onClick={() => navigate('/messages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Messages
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container py-8 max-w-3xl">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Messages
        </Button>
        
        {/* Message history section */}
        {existingMessages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Message History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingMessages.map((msg) => {
                const isFromMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`rounded-lg p-3 max-w-[80%] ${
                        isFromMe 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
        
        {/* New message card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                {recipient.avatar ? (
                  <img src={recipient.avatar} alt={recipient.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{recipient.name.split(' ').map(n => n[0]).join('')}</span>
                )}
              </Avatar>
              <div>
                <CardTitle>
                  Message to {recipient.name}
                  {recipient.role && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({recipient.role === 'client' ? 'Client' : 
                        recipient.role === 'admin' ? 'Admin' : 
                        recipient.role === 'project_manager' ? 'Project Manager' : 'Team Member'})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{recipient.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-36">
              <Textarea 
                placeholder="Type your message here..."
                className="min-h-36" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            {/* File attachments area */}
            {files.length > 0 && (
              <div className="border rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">Attachments:</p>
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li key={file.name} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center space-x-2 text-sm">
                        <PaperclipIcon className="h-4 w-4" />
                        <span>{file.name}</span>
                        <span className="text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile(file.name)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Button variant="outline" asChild className="relative">
                  <label>
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    Attach Files
                    <input 
                      type="file" 
                      multiple 
                      className="sr-only" 
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

// Helper function to create notifications for messages
const createMessageNotification = (senderId: string, recipientId: string, messagePreview: string) => {
  // Get sender information
  const sender = getUserById(senderId);
  if (!sender || !recipientId) return;
  
  const notificationId = `notif_${Date.now()}`;
  
  // Add to notifications array in notificationData
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

export default ClientMessage;
