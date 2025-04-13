import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Trash, ExternalLink, MailOpen, Mail } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: { toDate: () => Date } | Date;
  read: boolean;
}

const ContactsAdmin = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const db = getFirestore();
      const contactsCollection = collection(db, "contacts");
      const contactsQuery = query(contactsCollection, orderBy("createdAt", "desc"));
      const contactsSnapshot = await getDocs(contactsQuery);
      
      const messagesList = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<ContactMessage, 'id'>
      }));
      
      setMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Could not fetch contact messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const db = getFirestore();
      const messageRef = doc(db, 'contacts', id);
      await updateDoc(messageRef, { read: true });
      
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message.id === id ? { ...message, read: true } : message
        )
      );
      
      toast({
        title: "Success",
        description: "Message marked as read.",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({
        title: "Error",
        description: "Could not update message status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const db = getFirestore();
      const messageRef = doc(db, 'contacts', id);
      await deleteDoc(messageRef);
      
      setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
      
      toast({
        title: "Success",
        description: "Message deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Could not delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const fallbackData: ContactMessage[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      message: 'I would like to discuss a potential collaboration on an upcoming project.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      message: 'Your portfolio is impressive! I am looking for a developer with your skills for our company.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      message: 'Hello, I found your website through a colleague. Can we schedule a call to discuss a potential project?',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];

  const displayData = messages.length > 0 ? messages : fallbackData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-4">Loading messages...</p>
        ) : displayData.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No messages found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((item) => {
                const messageDate = item.createdAt instanceof Date ? 
                  item.createdAt : new Date((item.createdAt as any).toDate?.() || item.createdAt);
                
                return (
                  <TableRow key={item.id} className={!item.read ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">
                      <div>
                        {item.name}
                        <div className="text-sm text-gray-500">
                          <a href={`mailto:${item.email}`} className="hover:underline flex items-center gap-1">
                            {item.email}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="line-clamp-2">{item.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(messageDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {!item.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(item.id)}
                            title="Mark as read"
                          >
                            <MailOpen className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.location.href = `mailto:${item.email}?subject=Re: Your message`}
                          title="Reply"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteMessage(item.id)} 
                          className="text-destructive"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsAdmin;
