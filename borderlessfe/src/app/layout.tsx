"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}