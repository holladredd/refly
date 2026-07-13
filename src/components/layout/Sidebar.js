import React from "react";
import Image from "next/image";
import { FiPlus, FiMessageSquare, FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Sidebar panel — always visible on md+, slide-in on mobile */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 w-64
          bg-gray-900 border-r border-gray-700
          flex flex-col p-4
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + mobile close button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Refly Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-white font-bold text-lg tracking-wide">Refly</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* New Chat button */}
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors mb-6 border border-gray-600">
          <FiPlus className="text-xl" />
          <span className="font-medium">New Chat</span>
        </button>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">
              Today
            </p>
            <div className="space-y-1">
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300">
                <FiMessageSquare className="text-gray-400 shrink-0" />
                <span className="truncate">Documentary about African history</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300">
                <FiMessageSquare className="text-gray-400 shrink-0" />
                <span className="truncate">Cinematic drone footage ideas</span>
              </button>
            </div>
          </div>
        </div>

        {/* User settings footer */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
              U
            </div>
            <span className="font-medium text-sm text-gray-200">User Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
