import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getToken } from 'next-auth/jwt';
import { typeDefs, resolvers } from './schema/schema';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';


export type MyContext = {
  user: JWT | null;
};


const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});


const handler = startServerAndCreateNextHandler<NextRequest, MyContext>(server, {
  context: async (req) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return { user: token };
  },
});

export async function POST(req: Request, context: any) {
  return handler(req, context);
}

export async function GET(req: Request, context: any) {
  return handler(req, context);
}
