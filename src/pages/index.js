import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import ChatInput from '../components/chat/ChatInput';
import { RiMenuLine } from 'react-icons/ri';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <Head>
        <title>Refly - Creator Research AI</title>
        <meta name="description" content="AI-powered creator research platform" />
      </Head>

      {/* Mobile overlay backdrop — closes sidebar when tapping outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Open sidebar"
          >
            <RiMenuLine className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Refly" width={28} height={28} className="rounded-md object-contain" />
            <h1 className="font-bold text-lg tracking-wide text-white">Refly</h1>
          </div>
          {/* Empty div keeps title centered */}
          <div className="w-8" />
        </header>

        <ChatArea />
        <ChatInput />
      </div>
    </div>
  );
}
