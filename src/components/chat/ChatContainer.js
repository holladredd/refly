import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { useChat } from "@/context/ChatContext";
import Sidebar from "../layout/Sidebar";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import { RiMenuLine } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ChatContainer({ conversationId }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModel, setActiveModel] = useState("grok-2-1212");

  const { useConversationMessages, useSendMessageMutation } = useChat();

  const { data: messages = [], isLoading: isLoadingMessages } =
    useConversationMessages(conversationId);
  const sendMessageMutation = useSendMessageMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Sync activeModel state with conversation properties once loaded
  useEffect(() => {
    // If a conversation is loaded, we can detect if it's grok or gpt
    // Wait, the API returns { conversation, messages } in getConversationById,
    // and we stored it in the backend. If needed, we could fetch it,
    // but for now, syncing activeModel is fine.
  }, [conversationId]);

  const handleSendMessage = (messageText) => {
    sendMessageMutation.mutate(
      {
        conversationId,
        message: messageText,
        model: activeModel,
      },
      {
        onSuccess: (data) => {
          // If this was a new conversation, route to the newly created conversation page
          if (!conversationId && data.conversationId) {
            router.push(`/chat/${data.conversationId}`);
          }
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response?.data?.message || "Failed to send message.",
            background: "#1f2937",
            color: "#f3f4f6",
            confirmButtonColor: "#3b82f6",
          });
        },
      },
    );
  };

  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  const modelPlaceholder = "Ask Grok AI to find references or ideas...";

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <Head>
        <title>Refly - Chat Workspace</title>
      </Head>

      {/* Sidebar Panel */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeId={conversationId}
      />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity"
        />
      )}

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <RiMenuLine className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Refly"
              width={28}
              height={28}
              className="rounded-md object-contain"
            />
            <h1 className="font-bold text-lg tracking-wide text-white">
              Refly
            </h1>
          </div>
          <div className="w-8" />
        </header>

        {/* Chat Messages / Workspace Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoadingMessages}
          activeModel={activeModel}
          onModelChange={setActiveModel}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Input Bar */}
        <ChatInput
          onSubmit={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
          placeholder={modelPlaceholder}
          activeModel={activeModel}
          onModelChange={setActiveModel}
        />
      </div>
    </div>
  );
}
