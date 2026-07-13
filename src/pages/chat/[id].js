import React from 'react';
import { useRouter } from 'next/router';
import ChatContainer from '@/components/chat/ChatContainer';

export default function ActiveChatPage() {
  const router = useRouter();
  const { id } = router.query;

  // Wait for next.js router query to be populated
  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <ChatContainer conversationId={id} />;
}
