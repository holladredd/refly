import React, { useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";

const ChatInput = ({
  onSubmit,
  isLoading,
  placeholder,
  activeModel,
  onModelChange,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit(message.trim());
      setMessage("");
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
          <div className="absolute -top-12 right-0 flex items-center bg-gray-950/80 backdrop-blur-md border border-gray-800/80 rounded-full py-1 px-3 z-10 shadow-lg text-xs font-medium tracking-wide">
            <span className="text-gray-500 mr-2 uppercase text-[10px] tracking-widest font-bold">
              Model
            </span>
            <select
              disabled={isLoading}
              className="bg-transparent text-blue-400 font-semibold outline-none cursor-pointer hover:text-blue-300 transition-colors appearance-none pr-4 relative"
              value={activeModel || 'grok-4.5'}
              onChange={(e) => onModelChange && onModelChange(e.target.value)}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2360a5fa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right -0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="grok-4.5" className="bg-gray-900 text-gray-200">Grok 4.5 ✨</option>
              <option value="grok-4" className="bg-gray-900 text-gray-200">Grok 4.3</option>
              <option value="grok-2" className="bg-gray-900 text-gray-200">Grok 2</option>
            </select>
          </div>

          <input
            type="text"
            disabled={isLoading}
            className="w-full bg-gray-950 text-white placeholder-gray-500 rounded-xl py-4 pl-12 pr-14 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-800 shadow-sm disabled:opacity-60"
            placeholder={
              placeholder || "Ask Refly to find resources or ideas..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`absolute right-3 p-2 rounded-lg transition-colors ${
              message.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "text-gray-600"
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
          <p className="text-xs text-gray-600">
            Refly can make mistakes. Verify important license information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
