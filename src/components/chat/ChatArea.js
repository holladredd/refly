import React, { useRef, useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import {
  FiCpu,
  FiMessageSquare,
  FiTrendingUp,
  FiEdit2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";

const ChatArea = ({
  messages = [],
  isLoading,
  activeModel,
  onModelChange,
  onSuggestionClick,
  onEditMessage,
}) => {
  const messagesEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");

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
                {/* Username & Edit Actions */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  {isUser &&
                    editingMessageId !== msg._id &&
                    !msg.isLoading &&
                    !msg._id.toString().startsWith("temp-") && (
                      <button
                        onClick={() => {
                          setEditingMessageId(msg._id);
                          setEditContent(msg.content);
                        }}
                        className="text-gray-500 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="Edit prompt (Deletes subsequent messages)"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                    )}
                  <span className="text-xs text-gray-500">
                    {isUser ? "You" : "Refly"}
                  </span>
                </div>

                {/* Bubble Body */}
                <div
                  className={`relative p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border group ${
                    isUser
                      ? "bg-blue-600/15 border-blue-500/25 text-blue-50 rounded-tr-none shadow-md shadow-blue-500/5 w-full"
                      : "bg-gray-950/80 border-gray-800/80 text-gray-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Generating response...
                    </div>
                  ) : editingMessageId === msg._id ? (
                    <div className="flex flex-col gap-3 min-w-[250px] sm:min-w-[400px]">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-y"
                        placeholder="Edit your prompt..."
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <FiX /> Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (
                              editContent.trim() &&
                              editContent.trim() !== msg.content
                            ) {
                              onEditMessage(msg._id, editContent.trim());
                            }
                            setEditingMessageId(null);
                          }}
                          disabled={!editContent.trim()}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:opacity-50"
                        >
                          <FiCheck /> Save & Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    msg.content
                  )}
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
