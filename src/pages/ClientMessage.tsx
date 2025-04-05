
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
import { getUserById } from '@/data/mockData';
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';

const ClientMessage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const recipient = clientId ? getUserById(clientId) : null;
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  useEffect(() => {
    // Redirect to messages page if trying to access directly without recipient
    if (!recipient) {
      navigate('/messages');
    }
  }, [recipient, navigate]);
  
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
    
    setIsSending(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      console.log("Sending message to recipient:", clientId);
      console.log("Message:", message);
      console.log("Files:", files);
      
      toast({
        title: "Message sent successfully",
        description: "The recipient will receive your message in their dashboard"
      });
      
      // Navigate to the messages page after sending
      navigate('/messages');
      
      setMessage('');
      setFiles([]);
      setIsSending(false);
    }, 1500);
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

export default ClientMessage;
