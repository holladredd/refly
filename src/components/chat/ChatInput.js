import React, { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Trigger send message action
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSend} className="relative flex items-center">
          <button 
            type="button"
            className="absolute left-3 text-gray-400 hover:text-gray-200 p-2 transition-colors"
            title="Attach Media"
          >
            <FiPaperclip className="text-xl" />
          </button>
          
          <input
            type="text"
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-sm"
            placeholder="Ask Scout to find resources or ideas..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button
            type="submit"
            disabled={!message.trim()}
            className={`absolute right-3 p-2 rounded-lg transition-colors ${
              message.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-500'
            }`}
          >
            <FiSend className="text-xl" />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">Scout can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
