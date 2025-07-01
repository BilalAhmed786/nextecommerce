import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function getClient() {
  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:process.env.NEXT_PUBLIC_GRAPHQL_API 
      
    }),
  });
}
