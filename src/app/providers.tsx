'use client';

import { ReactNode } from "react";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../api/react-query/queryClient.js';

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
