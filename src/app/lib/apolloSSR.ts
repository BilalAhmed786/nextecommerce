// lib/apolloSSR.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export function getClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API , 
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
