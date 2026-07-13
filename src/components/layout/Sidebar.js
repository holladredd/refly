import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useChat } from '@/context/ChatContext';
import { FiPlus, FiMessageSquare, FiX, FiTrash2, FiEdit2, FiSearch, FiLogOut } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';
import Swal from 'sweetalert2';

const Sidebar = ({ isOpen, onClose, activeId }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    useConversations,
    useRenameConversationMutation,
    useDeleteConversationMutation,
  } = useChat();

  const { data: conversations = [], isLoading } = useConversations();
  const renameMutation = useRenameConversationMutation();
  const deleteMutation = useDeleteConversationMutation();

  const handleNewChat = () => {
    if (router.asPath === '/chat' || router.pathname === '/chat') {
      router.reload();
    } else {
      router.push('/chat');
    }
    if (onClose) onClose();
  };

  const handleSelectChat = (id) => {
    router.push(`/chat/${id}`);
    if (onClose) onClose();
  };

  const handleRename = async (e, id, currentTitle) => {
    e.stopPropagation();
    const { value: newTitle } = await Swal.fire({
      title: 'Rename Conversation',
      input: 'text',
      inputValue: currentTitle,
      showCancelButton: true,
      inputPlaceholder: 'Enter new title...',
      background: '#1f2937',
      color: '#f3f4f6',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#4b5563',
    });

    if (newTitle && newTitle.trim()) {
      renameMutation.mutate({ id, title: newTitle.trim() });
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete Conversation?',
      text: 'This will permanently remove this conversation history.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it',
      background: '#1f2937',
      color: '#f3f4f6',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            if (activeId === id) {
              router.push('/chat');
            }
          }
        });
      }
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`
        fixed top-0 left-0 h-full z-30 w-64
        bg-gray-950 border-r border-gray-900
        flex flex-col p-4
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Logo / Brand Name & Mobile Close Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
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
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-3 transition-colors mb-4 font-semibold shadow-md shadow-blue-500/10"
      >
        <FiPlus className="text-xl" />
        <span>New Chat</span>
      </button>

      {/* Search Input */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-700"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider">Conversations</p>
            <div className="space-y-0.5">
              {filteredConversations.map((conv) => {
                const isActive = activeId === conv._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectChat(conv._id)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-white' 
                        : 'border border-transparent text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <FiMessageSquare className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                      <span className="truncate text-sm font-medium">{conv.title}</span>
                    </div>

                    {/* Actions (visible on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity pl-2">
                      <button
                        onClick={(e) => handleRename(e, conv._id, conv.title)}
                        title="Rename"
                        className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, conv._id)}
                        title="Delete"
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">No chats found</p>
          </div>
        )}
      </div>

      {/* User settings / Logout */}
      <div className="mt-auto pt-4 border-t border-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-900 rounded-lg transition-all"
        >
          <FiLogOut className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
