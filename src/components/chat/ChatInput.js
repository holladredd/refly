import React, { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const ChatInput = ({ onSubmit, isLoading, placeholder }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-900 p-4 border-t border-gray-800">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSend} className="relative flex items-center">
          <button 
            type="button"
            disabled={isLoading}
            className="absolute left-3 text-gray-400 hover:text-gray-200 p-2 transition-colors disabled:opacity-50"
            title="Attach Media"
          >
            <FiPaperclip className="text-xl" />
          </button>
          
          <input
            type="text"
            disabled={isLoading}
            className="w-full bg-gray-950 text-white placeholder-gray-500 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-800 shadow-sm disabled:opacity-60"
            placeholder={placeholder || "Ask Refly to find resources or ideas..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`absolute right-3 p-2 rounded-lg transition-colors ${
              message.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-500' 
                : 'text-gray-600'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSend className="text-xl" />
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600">Refly can make mistakes. Verify important license information.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
