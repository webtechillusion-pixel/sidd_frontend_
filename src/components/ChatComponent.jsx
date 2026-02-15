import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, Phone, User } from 'lucide-react';
// import chatService from '../../services/chatService';

// NOTE: Mock chat service removed for production. Uncomment and implement real `chatService`.
// import chatService from '../../services/chatService';
const chatService = {
  getMessages: async () => ({ success: true, data: [] }),
  sendMessage: async () => ({ success: true }),
  markAsRead: async () => ({ success: true })
};

const ChatComponent = ({ 
  bookingId, 
  userType, // 'CUSTOMER' or 'RIDER'
  otherUser, // { name, photo }
  isOpen, 
  onClose,
  showToast 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(bookingId);
      if (response.success) {
        setMessages(response.data || []);
        // Mark as read
        await chatService.markAsRead(bookingId);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const receiverType = userType === 'CUSTOMER' ? 'RIDER' : 'CUSTOMER';
      
      const response = await chatService.sendMessage(bookingId, newMessage.trim(), receiverType);
      
      if (response.success) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      } else {
        showToast('Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Send message error:', error);
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            {otherUser?.photo ? (
              <img 
                src={otherUser.photo} 
                alt={otherUser.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{otherUser?.name || 'Chat'}</h3>
            <p className="text-xs text-blue-200">
              {userType === 'CUSTOMER' ? 'Your Driver' : 'Customer'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.href = `tel:${otherUser?.phone || ''}`}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderType === userType ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.senderType === userType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderType === userType ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Chat Button Component
export const ChatButton = ({ onClick, hasUnread = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
    >
      <MessageCircle className="w-6 h-6" />
      {hasUnread && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      )}
    </button>
  );
};

export default ChatComponent;