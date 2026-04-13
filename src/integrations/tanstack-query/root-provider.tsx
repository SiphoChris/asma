import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

export function getContext() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return {
    queryClient: client,
  };
}
