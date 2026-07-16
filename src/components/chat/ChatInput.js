import React, { useState } from "react";
import { FiSend, FiPaperclip, FiChevronDown } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

const MODELS = [
  { value: "grok-4", label: "Grok 4.3", badge: "" },
  { value: "grok-4.5", label: "Grok 4.5", badge: "" },
];

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

  const currentModel = MODELS.find((m) => m.value === activeModel) || MODELS[0];

  return (
    <div className="bg-gray-900 p-2 sm:p-4 border-t border-gray-800/60">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSend}
          className="flex flex-col bg-gray-800/50 border border-gray-700/50 rounded-2xl focus-within:border-gray-600 transition-colors"
        >
          {/* Text Input Row */}
          <div className="flex items-center px-4 pt-3 pb-2 gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-400 p-1 transition-colors disabled:opacity-40 shrink-0"
              title="Attach Media"
            >
              <FiPaperclip className="text-base" />
            </button>

            <input
              type="text"
              disabled={isLoading}
              className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 focus:outline-none text-sm py-1 disabled:opacity-50"
              placeholder={placeholder || "Ask Refly to find resources or ideas..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`shrink-0 p-2 rounded-xl transition-all ${
                message.trim() && !isLoading
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "text-gray-700 bg-gray-800/60 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-gray-200 rounded-full animate-spin" />
              ) : (
                <FiSend className="text-base" />
              )}
            </button>
          </div>

          {/* Bottom Toolbar Row */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700/40">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5">
              <RiRobot2Line className="text-sm text-gray-600" />
              <span className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
                Model
              </span>
              <div className="relative flex items-center">
                <select
                  disabled={isLoading}
                  value={activeModel || "grok-4"}
                  onChange={(e) => onModelChange && onModelChange(e.target.value)}
                  className="appearance-none bg-transparent text-gray-400 font-semibold text-xs pl-1 pr-5 outline-none cursor-pointer hover:text-gray-200 transition-colors disabled:opacity-50"
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-gray-900 text-gray-200">
                      {m.label} {m.badge}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 text-gray-600 text-xs pointer-events-none" />
              </div>
              {/* Active model label */}
              <span className="ml-1 px-1.5 py-0.5 bg-gray-700/60 text-gray-500 rounded-full text-[9px] font-semibold tracking-wide hidden sm:inline-block">
                {currentModel.label}
              </span>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-gray-700 hidden sm:block">
              Refly can make mistakes. Verify license info.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
