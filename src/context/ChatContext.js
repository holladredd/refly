import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

// Create the context
const ChatContext = createContext(null);

// Provider Component
export function ChatProvider({ children }) {
  const queryClient = useQueryClient();

  // 1. Fetch all conversations
  const useConversations = () => {
    return useQuery({
      queryKey: ["conversations"],
      queryFn: async () => {
        const { data } = await api.get("/conversations");
        return data;
      },
    });
  };

  // 2. Fetch messages for a specific conversation
  const useConversationMessages = (conversationId) => {
    return useQuery({
      queryKey: ["messages", conversationId],
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
        const { data } = await api.post("/conversations", { title, model });
        return data;
      },
      onSuccess: (newConv) => {
        // Optimistically update conversations list
        queryClient.setQueryData(["conversations"], (old = []) => [
          newConv,
          ...old,
        ]);
      },
    });
  };

  // 4. Send a message — STREAMING via SSE
  const useSendMessageMutation = () => {
    return useMutation({
      mutationFn: async ({ conversationId, message, model }) => {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        const response = await fetch(`${apiBase}/chat/stream`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, message, model }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Failed to send message");
        }

        // Read SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // We'll build a return object as events arrive
        let result = { conversationId, userMessage: null, assistantMessage: null };

        // Expose a way to push streaming updates upward — we call the callback stored in a ref
        const conversationIdToUpdate = conversationId;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); // keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith("event: ")) {
              // skip — we read the next data line below in the same batch
              continue;
            }

            if (line.startsWith("data: ")) {
              const rawData = line.slice(6);
              // find the event type from the preceding event line — simpler: parse raw
              try {
                const payload = JSON.parse(rawData);

                // Determine event type by shape of payload
                if (payload.text !== undefined) {
                  // "chunk" event — append text to streaming AI bubble
                  queryClient.setQueryData(
                    ["messages", conversationIdToUpdate],
                    (old = []) => {
                      const idx = old.findIndex((m) =>
                        m._id?.toString().startsWith("temp-ai-")
                      );
                      if (idx === -1) return old;
                      const updated = [...old];
                      updated[idx] = {
                        ...updated[idx],
                        content: (updated[idx].content || "") + payload.text,
                        isLoading: false,
                      };
                      return updated;
                    }
                  );
                } else if (payload.userMessage && payload.assistantMessage) {
                  // "done" event
                  result = payload;
                } else if (payload.conversationId && !payload.userMessage) {
                  // "conversation" event — new conversation created
                  result.conversationId = payload.conversationId;
                }
              } catch {
                // ignore parse errors in individual lines
              }
            }
          }
        }

        return result;
      },

      onMutate: async ({ conversationId, message }) => {
        await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
        const previousMessages = queryClient.getQueryData(["messages", conversationId]);

        const tempUserMessage = {
          _id: `temp-user-${Date.now()}`,
          role: "user",
          content: message,
          createdAt: new Date().toISOString(),
        };

        const tempAiMessage = {
          _id: `temp-ai-${Date.now()}`,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
          isLoading: true,
        };

        queryClient.setQueryData(["messages", conversationId], (old = []) => [
          ...old,
          tempUserMessage,
          tempAiMessage,
        ]);

        return { previousMessages, conversationId };
      },

      onError: (err, variables, context) => {
        if (context?.previousMessages) {
          queryClient.setQueryData(
            ["messages", context.conversationId],
            context.previousMessages
          );
        }
      },

      onSuccess: (data, variables, context) => {
        const convId = data?.conversationId || context?.conversationId;
        // Replace temp messages with the real saved messages
        queryClient.setQueryData(["messages", convId], (old = []) => {
          const filtered = old.filter(
            (msg) => !msg._id?.toString().startsWith("temp-")
          );
          const newMessages = [];
          if (data?.userMessage) newMessages.push(data.userMessage);
          if (data?.assistantMessage) newMessages.push(data.assistantMessage);
          return [...filtered, ...newMessages];
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  // 4b. Edit/Resend message mutation
  const useEditMessageMutation = () => {
    return useMutation({
      mutationFn: async ({ conversationId, messageId, content, model }) => {
        const { data } = await api.post("/chat/edit", {
          conversationId,
          messageId,
          content,
          model,
        });
        return data;
      },
      onMutate: async (newEdit) => {
        await queryClient.cancelQueries({
          queryKey: ["messages", newEdit.conversationId],
        });
        const previousMessages = queryClient.getQueryData([
          "messages",
          newEdit.conversationId,
        ]);

        if (previousMessages) {
          const targetIndex = previousMessages.findIndex(
            (m) => m._id === newEdit.messageId,
          );
          if (targetIndex !== -1) {
            const updatedMessages = previousMessages.slice(0, targetIndex);

            const tempMessage = {
              _id: `temp-edit-${Date.now()}`,
              conversationId: newEdit.conversationId,
              role: "user",
              content: newEdit.content,
              createdAt: new Date().toISOString(),
            };

            const tempAiMessage = {
              _id: `temp-ai-${Date.now()}`,
              conversationId: newEdit.conversationId,
              role: "assistant",
              content: "",
              createdAt: new Date().toISOString(),
              isLoading: true,
            };

            queryClient.setQueryData(
              ["messages", newEdit.conversationId],
              [...updatedMessages, tempMessage, tempAiMessage],
            );
          }
        }
        return { previousMessages, conversationId: newEdit.conversationId };
      },
      onError: (err, newEdit, context) => {
        if (context?.previousMessages) {
          queryClient.setQueryData(
            ["messages", context.conversationId],
            context.previousMessages,
          );
        }
      },
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData(
          ["messages", context.conversationId],
          (old = []) => {
            const filtered = old.filter(
              (msg) => !msg._id.toString().startsWith("temp-"),
            );
            return [...filtered, data.userMessage, data.assistantMessage];
          },
        );
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
        await queryClient.cancelQueries({ queryKey: ["conversations"] });

        const previousConversations = queryClient.getQueryData([
          "conversations",
        ]);

        // Optimistically rename the conversation in the cache
        queryClient.setQueryData(["conversations"], (old = []) =>
          old.map((conv) => (conv._id === id ? { ...conv, title } : conv)),
        );

        return { previousConversations };
      },
      onError: (err, variables, context) => {
        if (context?.previousConversations) {
          queryClient.setQueryData(
            ["conversations"],
            context.previousConversations,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
        await queryClient.cancelQueries({ queryKey: ["conversations"] });

        const previousConversations = queryClient.getQueryData([
          "conversations",
        ]);

        // Optimistically remove from list
        queryClient.setQueryData(["conversations"], (old = []) =>
          old.filter((conv) => conv._id !== id),
        );

        return { previousConversations };
      },
      onError: (err, variables, context) => {
        if (context?.previousConversations) {
          queryClient.setQueryData(
            ["conversations"],
            context.previousConversations,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  const value = {
    useConversations,
    useConversationMessages,
    useCreateConversationMutation,
    useSendMessageMutation,
    useEditMessageMutation,
    useRenameConversationMutation,
    useDeleteConversationMutation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook to easily consume this context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
