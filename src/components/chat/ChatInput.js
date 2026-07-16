import React, { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

const ChatInput = ({ onSubmit, isLoading, placeholder, activeModel, onModelChange }) => {
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
          <div className="absolute -top-10 right-0 flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg p-1 z-10 shadow-sm text-xs text-gray-400">
            <span>Model:</span>
            <select
              disabled={isLoading}
              className="bg-transparent text-gray-200 outline-none cursor-pointer hover:text-white"
              value={activeModel || 'grok-2-1212'}
              onChange={(e) => onModelChange && onModelChange(e.target.value)}
            >
              <option value="grok-2-1212">Grok 2 (1212)</option>
              <option value="grok-2">Grok 2</option>
              <option value="grok-2-vision-1212">Grok Vision</option>
            </select>
          </div>
          
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
