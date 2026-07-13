import React, { useRef, useEffect } from 'react';
import MediaCard from './MediaCard';
import { FiCpu, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

const ChatArea = ({ messages = [], isLoading, activeModel, onModelChange, onSuggestionClick }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    'Cinematic drone footage of Lagos night view',
    'Historical photos of ancient Egyptian structures',
    'Traditional African ambient instrumental music',
    'Close up slow motion shots of wild lions'
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm">Loading conversation history...</p>
      </div>
    );
  }

  // Welcome / Starting Screen
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-900 p-6 md:p-8 flex flex-col justify-center items-center text-gray-200">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="Refly Logo"
              width={72}
              height={72}
              className="rounded-2xl shadow-xl shadow-blue-500/5 object-contain"
            />
            <h2 className="text-3xl font-extrabold tracking-tight">What are we researching today?</h2>
            <p className="text-gray-400 max-w-md">
              Scout stock videos, high-resolution images, and audio tracks with AI.
            </p>
          </div>

          {/* Model Selection Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => onModelChange('gpt')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                activeModel === 'gpt'
                  ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/5'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
              }`}
            >
              <FiCpu className={`text-xl mt-0.5 ${activeModel === 'gpt' ? 'text-blue-400' : 'text-gray-500'}`} />
              <div>
                <p className="font-semibold text-sm">OpenAI GPT</p>
                <p className="text-xs text-gray-500 mt-0.5">Logical, great for outlines & media matching.</p>
              </div>
            </button>

            <button
              onClick={() => onModelChange('grok')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                activeModel === 'grok'
                  ? 'bg-purple-600/10 border-purple-500 text-white shadow-lg shadow-purple-500/5'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
              }`}
            >
              <FiCpu className={`text-xl mt-0.5 ${activeModel === 'grok' ? 'text-purple-400' : 'text-gray-500'}`} />
              <div>
                <p className="font-semibold text-sm">Grok AI</p>
                <p className="text-xs text-gray-500 mt-0.5">Creative, witty, excellent style suggestions.</p>
              </div>
            </button>
          </div>

          {/* Suggestions */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FiTrendingUp />
              <span>Suggested prompts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(s)}
                  className="bg-gray-950 border border-gray-800 hover:bg-gray-900 hover:border-gray-700 text-gray-300 rounded-xl p-3.5 text-sm text-left transition-all truncate"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-8 text-gray-200">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg._id} className="flex gap-4">
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white ${
                  isUser
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                }`}
              >
                {isUser ? 'U' : 'AI'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold mb-1 text-gray-300 text-sm">
                  {isUser ? 'You' : 'Refly'}
                </p>
                <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Display Media Cards if any are present in the message */}
                {msg.mediaResults && msg.mediaResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {msg.mediaResults.map((item, idx) => (
                      <MediaCard key={idx} media={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
