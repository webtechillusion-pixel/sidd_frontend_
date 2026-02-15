import React from 'react';

export function Communication({ 
  messages, 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  handleQuickResponse 
}) {
  return (
    <div className="space-y-6">
      {/* Support Chat */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Support Chat</h3>
        <div className="bg-gray-50 rounded-lg p-4 h-64 mb-4 overflow-y-auto">
          <div className="space-y-3">
            {messages.map(message => (
              <div key={message.id} className={`p-3 rounded-lg max-w-xs ${
                message.sender === 'support' ? 'bg-blue-100' : 'bg-teal-100 ml-auto'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs text-gray-500">
                  {message.sender === 'support' ? 'Support Team' : 'You'} - {message.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 p-3 border rounded-lg"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>

      {/* Quick Response Templates */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Response Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'I\'m on my way to pickup location',
            'I\'ve arrived at pickup point',
            'Traffic is heavy, will be 5 minutes late',
            'Thank you for choosing our service'
          ].map((template, index) => (
            <button 
              key={index} 
              onClick={() => handleQuickResponse(template)}
              className="p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              <p className="text-sm">{template}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Announcements</h3>
        <div className="space-y-3">
          {[
            { title: 'New Surge Pricing Policy', date: '2024-01-15', type: 'Policy' },
            { title: 'Weekend Bonus Campaign', date: '2024-01-14', type: 'Promotion' },
            { title: 'App Update Available', date: '2024-01-13', type: 'Update' }
          ].map((announcement, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{announcement.title}</h4>
                  <p className="text-sm text-gray-600">{announcement.date}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {announcement.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}