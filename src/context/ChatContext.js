import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Create the context
const ChatContext = createContext(null);

// Provider Component
export function ChatProvider({ children }) {
  const queryClient = useQueryClient();

  // 1. Fetch all conversations
  const useConversations = () => {
    return useQuery({
      queryKey: ['conversations'],
      queryFn: async () => {
        const { data } = await api.get('/conversations');
        return data;
      },
    });
  };

  // 2. Fetch messages for a specific conversation
  const useConversationMessages = (conversationId) => {
    return useQuery({
      queryKey: ['messages', conversationId],
      queryFn: async () => {
        const { data } = await api.get(`/conversations/${conversationId}`);
        return data.messages; // Returns the array of messages
      },
      enabled: !!conversationId,
    });
  };

  // 3. Create a new conversation mutation
  const useCreateConversationMutation = () => {
    return useMutation({
      mutationFn: async ({ title, model }) => {
        const { data } = await api.post('/conversations', { title, model });
        return data;
      },
      onSuccess: (newConv) => {
        // Optimistically update conversations list
        queryClient.setQueryData(['conversations'], (old = []) => [newConv, ...old]);
      },
    });
  };

  // 4. Send a message mutation with Optimistic Updates
  const useSendMessageMutation = () => {
    return useMutation({
      mutationFn: async ({ conversationId, message, model }) => {
        const { data } = await api.post('/chat', { conversationId, message, model });
        return data;
      },
      onMutate: async ({ conversationId, message }) => {
        // Cancel outgoing refetches so they don't overwrite optimistic update
        await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });

        // Snapshot the previous messages value
        const previousMessages = queryClient.getQueryData(['messages', conversationId]);

        // Optimistically append the user message to the active conversation
        const tempUserMessage = {
          _id: `temp-user-${Date.now()}`,
          role: 'user',
          content: message,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(['messages', conversationId], (old = []) => [
          ...old,
          tempUserMessage,
        ]);

        return { previousMessages, conversationId };
      },
      onError: (err, variables, context) => {
        // Rollback to previous state if error occurs
        if (context?.previousMessages) {
          queryClient.setQueryData(
            ['messages', context.conversationId],
            context.previousMessages
          );
        }
      },
      onSuccess: (data, variables, context) => {
        // Replace optimistic message and append AI response
        queryClient.setQueryData(['messages', context.conversationId], (old = []) => {
          // Remove the temp user message and add real ones
          const filtered = old.filter((msg) => !msg._id.toString().startsWith('temp-user-'));
          return [...filtered, data.userMessage, data.assistantMessage];
        });

        // Invalidate conversations list to update titles/timestamps
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  // 5. Rename a conversation mutation
  const useRenameConversationMutation = () => {
    return useMutation({
      mutationFn: async ({ id, title }) => {
        const { data } = await api.put(`/conversations/${id}`, { title });
        return data;
      },
      onMutate: async ({ id, title }) => {
        await queryClient.cancelQueries({ queryKey: ['conversations'] });

        const previousConversations = queryClient.getQueryData(['conversations']);

        // Optimistically rename the conversation in the cache
        queryClient.setQueryData(['conversations'], (old = []) =>
          old.map((conv) => (conv._id === id ? { ...conv, title } : conv))
        );

        return { previousConversations };
      },
      onError: (err, variables, context) => {
        if (context?.previousConversations) {
          queryClient.setQueryData(['conversations'], context.previousConversations);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  // 6. Delete a conversation mutation
  const useDeleteConversationMutation = () => {
    return useMutation({
      mutationFn: async (id) => {
        const { data } = await api.delete(`/conversations/${id}`);
        return data;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['conversations'] });

        const previousConversations = queryClient.getQueryData(['conversations']);

        // Optimistically remove from list
        queryClient.setQueryData(['conversations'], (old = []) =>
          old.filter((conv) => conv._id !== id)
        );

        return { previousConversations };
      },
      onError: (err, variables, context) => {
        if (context?.previousConversations) {
          queryClient.setQueryData(['conversations'], context.previousConversations);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  const value = {
    useConversations,
    useConversationMessages,
    useCreateConversationMutation,
    useSendMessageMutation,
    useRenameConversationMutation,
    useDeleteConversationMutation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook to easily consume this context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
