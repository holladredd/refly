import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";

export default function App({ Component, pageProps }) {
  // Create query client once per application life
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
    // Check user auth on initial mount
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
