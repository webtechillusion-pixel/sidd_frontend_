import api from './api';

const chatService = {
  // Send message
  sendMessage: async (bookingId, message, receiverType) => {
    try {
      const res = await api.post('/api/chat/send', {
        bookingId,
        message,
        receiverType // 'CUSTOMER' or 'RIDER'
      });
      return res.data;
    } catch (err) {
      console.error('Send message error:', err);
      throw err;
    }
  },

  // Get chat messages
  getMessages: async (bookingId) => {
    try {
      const res = await api.get(`/api/chat/${bookingId}`);
      return res.data;
    } catch (err) {
      console.error('Get messages error:', err);
      throw err;
    }
  },

  // Mark messages as read
  markAsRead: async (bookingId) => {
    try {
      const res = await api.put(`/api/chat/${bookingId}/read`);
      return res.data;
    } catch (err) {
      console.error('Mark as read error:', err);
      throw err;
    }
  }
};

export default chatService;