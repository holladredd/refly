import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import { ChatProvider } from "@/context/ChatContext";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </QueryClientProvider>
  );
}
