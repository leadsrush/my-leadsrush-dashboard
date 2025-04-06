
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, users } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle } from 'lucide-react';

interface NewMessageDialogProps {
  onSelectRecipient: (recipientId: string) => void;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({ onSelectRecipient }) => {
  const [open, setOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Filter users based on the current user's role
  const getAvailableRecipients = (): User[] => {
    if (!user) return [];

    if (hasRole(['admin'])) {
      // Admin can message everyone
      return users.filter(u => u.id !== user.id);
    } else if (hasRole(['project_manager', 'team_member'])) {
      // Team members can message other team members, admins, and clients
      return users.filter(u => u.id !== user.id);
    } else if (hasRole(['client'])) {
      // Clients can only message admins and team members
      return users.filter(u => u.role !== 'client' && u.id !== user.id);
    }
    
    return [];
  };

  const availableRecipients = getAvailableRecipients();

  const handleStartConversation = () => {
    if (selectedRecipient) {
      onSelectRecipient(selectedRecipient);
      setOpen(false);
      setSelectedRecipient('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Select recipient</Label>
            <Select
              value={selectedRecipient}
              onValueChange={setSelectedRecipient}
            >
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {availableRecipients.map(recipient => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    {recipient.name} {recipient.role === 'client' ? '(Client)' : 
                     recipient.role === 'admin' ? '(Admin)' : 
                     recipient.role === 'project_manager' ? '(Project Manager)' : '(Team Member)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full"
            onClick={handleStartConversation}
            disabled={!selectedRecipient}
          >
            Start Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
