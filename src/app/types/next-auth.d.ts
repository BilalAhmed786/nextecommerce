// types/next-auth.d.ts
import type {NextAuth} from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role:string
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role:string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role:string
  }
}