import React, { useRef, useEffect, useState, useCallback } from "react";
import MediaCard from "./MediaCard";
import { FiTrendingUp, FiEdit2, FiX, FiCheck } from "react-icons/fi";
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
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea as content grows
  const handleEditChange = useCallback((e) => {
    setEditContent(e.target.value);
    // Reset height to auto so it shrinks too, then set to scrollHeight
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  // Set initial height when entering edit mode
  useEffect(() => {
    if (editingMessageId && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [editingMessageId]);

  const suggestions = [
    "Cinematic drone footage of Lagos night view",
    "Historical photos of ancient Egyptian structures",
    "Traditional African ambient instrumental music",
    "Close up slow motion shots of wild lions",
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin mb-4" />
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
              className="rounded-2xl object-contain opacity-90"
            />
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              What are we researching today?
            </h2>
            <p className="text-gray-500 max-w-md text-sm">
              Scout stock videos, high-resolution images, and audio tracks with AI.
            </p>
          </div>

          {/* Suggestions */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <FiTrendingUp />
              <span>Suggested prompts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(s)}
                  className="bg-gray-800/60 border border-gray-700/60 hover:bg-gray-800 hover:border-gray-600 text-gray-300 rounded-xl p-3.5 text-sm text-left transition-all"
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
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg._id}
              className={`flex gap-3 w-full items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar — neutral monochrome */}
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-semibold text-[11px] text-gray-300 ${
                  isUser
                    ? "bg-gray-700"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {isUser ? "U" : "AI"}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`flex flex-col max-w-[78%] group ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Username & Edit icon */}
                <div className={`flex items-center gap-1.5 mb-1 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <span className="text-[11px] text-gray-600">
                    {isUser ? "You" : "Refly"}
                  </span>
                  {isUser &&
                    editingMessageId !== msg._id &&
                    !msg.isLoading &&
                    !msg._id.toString().startsWith("temp-") && (
                      <button
                        onClick={() => {
                          setEditingMessageId(msg._id);
                          setEditContent(msg.content);
                        }}
                        className="text-gray-700 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                        title="Edit prompt"
                      >
                        <FiEdit2 className="text-[11px]" />
                      </button>
                    )}
                </div>

                {/* Bubble Body */}
                {editingMessageId === msg._id ? (
                  /* ── EDIT MODE: plain, no border, blends in ── */
                  <div className="flex flex-col gap-2 w-full">
                    <textarea
                      ref={textareaRef}
                      value={editContent}
                      onChange={handleEditChange}
                      className="w-full bg-gray-800/50 text-gray-100 rounded-xl p-3 text-sm focus:outline-none resize-none overflow-hidden transition-colors leading-relaxed"
                      placeholder="Edit your prompt..."
                      rows={1}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors rounded-md hover:bg-gray-800/40"
                      >
                        <FiX className="text-[11px]" /> Cancel
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
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-40"
                      >
                        <FiCheck className="text-[11px]" /> Resend
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── NORMAL BUBBLE ── */
                  <div
                    className={`relative p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-gray-800 text-gray-100 rounded-tr-none"
                        : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
                        <span>Generating response...</span>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                )}

                {/* Media Cards */}
                {msg.mediaResults && msg.mediaResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full">
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
