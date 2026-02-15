import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Phone, X, MapPin } from 'lucide-react';

const CustomerRiderChat = ({ 
  bookingId, 
  userType, // 'CUSTOMER' or 'RIDER'
  otherUser, 
  isOpen, 
  onClose, 
  showToast 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock messages for demo removed for production
  useEffect(() => {
    if (isOpen && bookingId) {
      // Production: messages should be fetched from real chat service/socket
      setMessages([]);
    }
  }, [isOpen, bookingId, userType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: userType === 'CUSTOMER' ? 'customer456' : 'rider123',
      senderType: userType,
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      const response = {
        id: Date.now() + 1,
        senderId: userType === 'CUSTOMER' ? 'rider123' : 'customer456',
        senderType: userType === 'CUSTOMER' ? 'RIDER' : 'CUSTOMER',
        message: userType === 'CUSTOMER' ? 'Got it, thanks!' : 'Sure, no problem!',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const sendQuickMessage = (message) => {
    const quickMsg = {
      id: Date.now(),
      senderId: userType === 'CUSTOMER' ? 'customer456' : 'rider123',
      senderType: userType,
      message,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, quickMsg]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickMessages = userType === 'CUSTOMER' ? [
    'I am here',
    'Running 5 minutes late',
    'Where are you?',
    'Thank you'
  ] : [
    'On my way',
    'Reached pickup point',
    'Traffic jam, will be late',
    'Starting the trip'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
      <div className="bg-white w-full max-w-md h-[80vh] md:h-[600px] md:rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white md:rounded-t-lg">
          <div className="flex items-center">
            <img
              src={otherUser?.photo || `https://ui-avatars.com/api/?name=${otherUser?.name}&background=4F46E5&color=fff`}
              alt={otherUser?.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{otherUser?.name}</h3>
              <p className="text-sm text-blue-200">
                {userType === 'CUSTOMER' ? 'Your Driver' : 'Customer'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = `tel:${otherUser?.phone}`}
              className="p-2 hover:bg-blue-700 rounded-lg"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderType === userType ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.senderType === userType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderType === userType ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages */}
        <div className="p-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 mb-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => sendQuickMessage(msg)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Button Component
export const ChatButton = ({ onClick, hasUnread = false }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-40"
  >
    <MessageCircle className="h-6 w-6" />
    {hasUnread && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
    )}
  </button>
);

export default CustomerRiderChat;