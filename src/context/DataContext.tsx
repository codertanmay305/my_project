import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document, Message, User } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  documents: Document[];
  messages: Message[];
  allUsers: User[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'isRead' | 'senderName' | 'recipientName'>) => void;
  markMessageAsRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedDocuments = localStorage.getItem('documents');
    const storedMessages = localStorage.getItem('messages');
    const storedUsers = localStorage.getItem('allUsers');

    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    if (user && !allUsers.find(u => u.id === user.id)) {
      const updatedUsers = [...allUsers, user];
      setAllUsers(updatedUsers);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
  }, [user]);

  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...documents, newDocument];
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const updated = documents.map(d =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
    );
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
  };

  const sendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'isRead' | 'senderName' | 'recipientName'>) => {
    const sender = allUsers.find(u => u.id === message.senderId);
    const recipient = allUsers.find(u => u.id === message.recipientId);

    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      senderName: sender?.fullName || 'Unknown',
      recipientName: recipient?.fullName || 'Unknown',
      isRead: false,
      createdAt: new Date(),
    };
    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem('messages', JSON.stringify(updated));
  };

  const markMessageAsRead = (id: string) => {
    const updated = messages.map(m =>
      m.id === id ? { ...m, isRead: true } : m
    );
    setMessages(updated);
    localStorage.setItem('messages', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider
      value={{
        documents,
        messages,
        allUsers,
        addDocument,
        updateDocument,
        deleteDocument,
        sendMessage,
        markMessageAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
