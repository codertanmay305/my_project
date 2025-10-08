import React, { useState } from 'react';
import { Send, Mail, MailOpen, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { messages, allUsers, sendMessage, markMessageAsRead } = useData();
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipientId: '',
    subject: '',
    content: '',
  });

  const teachers = allUsers.filter(u => u.role === 'teacher');
  const students = allUsers.filter(u => u.role === 'student');

  const myMessages = messages.filter(
    m => m.senderId === user?.id || m.recipientId === user?.id
  );

  const inbox = myMessages.filter(m => m.recipientId === user?.id);
  const sent = myMessages.filter(m => m.senderId === user?.id);
  const unreadCount = inbox.filter(m => !m.isRead).length;

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientId) {
      alert('Please select a recipient');
      return;
    }

    sendMessage({
      senderId: user!.id,
      recipientId: formData.recipientId,
      subject: formData.subject,
      content: formData.content,
    });

    setFormData({ recipientId: '', subject: '', content: '' });
    setShowCompose(false);
  };

  const handleMessageClick = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.recipientId === user?.id && !message.isRead) {
      markMessageAsRead(messageId);
    }
    setSelectedMessage(messageId);
  };

  const recipientOptions = user?.role === 'student' ? teachers : students;

  return (
    <div className="space-y-6">
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">New Message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  To *
                </label>
                <select
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select recipient</option>
                  {recipientOptions.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.fullName} ({recipient.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const message = messages.find(m => m.id === selectedMessage);
              if (!message) return null;

              return (
                <>
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-slate-600">From</p>
                      <p className="font-semibold text-slate-900">{message.senderName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">To</p>
                      <p className="font-semibold text-slate-900">{message.recipientName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Subject</p>
                      <p className="font-semibold text-slate-900">{message.subject}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Date</p>
                      <p className="text-slate-900">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-600 mb-2">Message</p>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-slate-900 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
            <p className="text-slate-600 mt-1">
              Communicate with {user?.role === 'student' ? 'teachers' : 'students'}
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            New Message
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'inbox'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Inbox {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'sent'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Sent
          </button>
        </div>

        <div className="space-y-2">
          {activeTab === 'inbox' && inbox.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No messages in your inbox</p>
            </div>
          )}

          {activeTab === 'sent' && sent.length === 0 && (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No sent messages</p>
            </div>
          )}

          {activeTab === 'inbox' &&
            inbox.map((message) => (
              <button
                key={message.id}
                onClick={() => handleMessageClick(message.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                  message.isRead
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {message.isRead ? (
                        <MailOpen className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold ${message.isRead ? 'text-slate-900' : 'text-blue-900'}`}>
                          {message.senderName}
                        </span>
                        {!message.isRead && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className={`font-medium mb-1 ${message.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2">{message.content}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 ml-4">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}

          {activeTab === 'sent' &&
            sent.map((message) => (
              <button
                key={message.id}
                onClick={() => handleMessageClick(message.id)}
                className="w-full text-left p-4 rounded-lg border border-slate-200 bg-white transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      <Send className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 mb-1">
                        To: {message.recipientName}
                      </div>
                      <p className="font-medium text-slate-700 mb-1">{message.subject}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{message.content}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 ml-4">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
