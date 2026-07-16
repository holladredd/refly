import React, { useState } from "react";
import { FiSend, FiPaperclip, FiChevronDown } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

const MODELS = [
  { value: "grok-4", label: "Grok 4.3", badge: "" },
  { value: "grok-4.5", label: "Grok 4.5", badge: "✨" },
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
    <div className="bg-gray-900 p-4 border-t border-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Input Box */}
        <form
          onSubmit={handleSend}
          className="flex flex-col bg-gray-950 border border-gray-800 rounded-2xl shadow-lg focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all"
        >
          {/* Text Input Row */}
          <div className="flex items-center px-4 pt-3 pb-2 gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-300 p-1 transition-colors disabled:opacity-40 shrink-0"
              title="Attach Media"
            >
              <FiPaperclip className="text-lg" />
            </button>

            <input
              type="text"
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm py-1 disabled:opacity-60"
              placeholder={placeholder || "Ask Refly to find resources or ideas..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`shrink-0 p-2 rounded-xl transition-all ${
                message.trim() && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20"
                  : "text-gray-600 bg-gray-800/50"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="text-base" />
              )}
            </button>
          </div>

          {/* Bottom Toolbar Row */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800/60">
            {/* Model Selector — inside the input box */}
            <div className="flex items-center gap-1.5">
              <RiRobot2Line className="text-sm text-gray-500" />
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Model</span>
              <div className="relative flex items-center">
                <select
                  disabled={isLoading}
                  value={activeModel || "grok-4"}
                  onChange={(e) => onModelChange && onModelChange(e.target.value)}
                  className="appearance-none bg-transparent text-blue-400 font-semibold text-xs pl-1 pr-5 outline-none cursor-pointer hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-gray-900 text-gray-200">
                      {m.label} {m.badge}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 text-blue-400 text-xs pointer-events-none" />
              </div>
              {/* Active model pill badge */}
              <span className="ml-1 px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[9px] font-bold tracking-wide">
                {currentModel.label} {currentModel.badge}
              </span>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-gray-600 hidden sm:block">
              Refly can make mistakes. Verify license info.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
