// app/providers.tsx
'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apolloClinet';

export function Providers({ children, session }: { children: ReactNode; session?: any }) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </SessionProvider>
  );
}
