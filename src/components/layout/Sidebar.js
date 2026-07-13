import React from 'react';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col p-4 border-r border-gray-700 hidden md:flex">
      <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors mb-6 border border-gray-600">
        <FiPlus className="text-xl" />
        <span className="font-medium">New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wider">Today</p>
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

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button className="flex items-center gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            U
          </div>
          <span className="font-medium text-sm text-gray-200">User Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
