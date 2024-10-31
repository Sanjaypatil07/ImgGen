// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware({
//   publicRoutes:['/api/webhooks/clerk']
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';

const publicRoutes = ['/public', '/api/webhooks/clerk'];

export default function middleware(request: { (auth: ClerkMiddlewareAuth, request: NextRequest, event: NextFetchEvent): NextMiddlewareResult | Promise<NextMiddlewareResult>; nextUrl?: any; }) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next(); // Allow access without authentication
  }

  // Apply Clerk's middleware for protected routes
  return clerkMiddleware(request);
}

// Apply middleware to all routes except _next/static and favicon
export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)',
};
