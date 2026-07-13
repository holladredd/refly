import React, { useRef, useEffect } from "react";
import MediaCard from "./MediaCard";
import { FiCpu, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import Image from "next/image";

const ChatArea = ({
  messages = [],
  isLoading,
  activeModel,
  onModelChange,
  onSuggestionClick,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    "Cinematic drone footage of Lagos night view",
    "Historical photos of ancient Egyptian structures",
    "Traditional African ambient instrumental music",
    "Close up slow motion shots of wild lions",
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
            <h2 className="text-3xl font-extrabold tracking-tight">
              What are we researching today?
            </h2>
            <p className="text-gray-400 max-w-md">
              Scout stock videos, high-resolution images, and audio tracks with
              AI.
            </p>
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
          const isUser = msg.role === "user";
          return (
            <div
              key={msg._id}
              className={`flex gap-3 w-full items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                  isUser
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600"
                    : "bg-gradient-to-tr from-emerald-600 to-teal-600"
                }`}
              >
                {isUser ? "U" : "AI"}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Username */}
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {isUser ? "You" : "Refly"}
                </span>

                {/* Bubble Body */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border ${
                    isUser
                      ? "bg-blue-600/15 border-blue-500/25 text-blue-50 rounded-tr-none shadow-md shadow-blue-500/5"
                      : "bg-gray-950/80 border-gray-800/80 text-gray-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Media Cards (only for AI assistant responses) */}
                {msg.mediaResults && msg.mediaResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
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
