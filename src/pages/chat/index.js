import React from 'react';
import { useRouter } from 'next/router';
import ChatContainer from '@/components/chat/ChatContainer';

export default function NewChatPage() {
  const router = useRouter();
  return <ChatContainer key={router.query.t || 'new'} />;
}
