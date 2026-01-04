import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,                     
      refetchOnWindowFocus: false,  
      staleTime: 0,  
      gcTime: 0, 
    },
    mutations: {
      retry: 0,
    },
  },
});


export const BASE_URL = process.env.NEXT_PUBLIC_API_URL