import React, { useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import ChatInput from '../components/chat/ChatInput';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  // On mount, check if user is authenticated (can also be handled in _app.js)
  // For milestone 1, we will bypass strict auth checks for the UI preview
  
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <Head>
        <title>Refly (Scout) - Creator Research AI</title>
        <meta name="description" content="AI-powered creator research platform" />
      </Head>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <h1 className="font-bold text-lg tracking-wide text-white">Scout</h1>
          <button className="text-gray-300 p-2">Menu</button>
        </header>

        <ChatArea />
        <ChatInput />
      </div>
    </div>
  );
}
