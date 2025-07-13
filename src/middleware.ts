// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

            if(token && (pathname.startsWith('/login') ||  pathname.startsWith('/register'))){

                return NextResponse.redirect(new URL('/', req.url))

            }

            if(token?.role !== 'ADMIN' && pathname.startsWith('/authorize/admin')){

                return NextResponse.redirect(new URL('/login', req.url))

            }

            if(token?.role !== 'CUSTOMER' && pathname.startsWith('/authorize/client')){

                return NextResponse.redirect(new URL('/login', req.url))

            }

            
               return NextResponse.next();
 
   }
