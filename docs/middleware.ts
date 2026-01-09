import { NextRequest, NextResponse } from 'next/server'

// Simple middleware - authentication handled by Vercel Password Protection
export default function middleware(req: NextRequest) {
  // No authentication logic needed - Vercel handles password protection
  return NextResponse.next()
}

// Optional: You can still use middleware for other purposes
export const config = {
  matcher: [
    // Only run middleware on specific paths if needed
    // For now, just pass through everything
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

/* 
COMMENTED OUT: NextAuth middleware (only needed for Azure AD/OAuth)

import { withAuth } from 'next-auth/middleware'

export default function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development' || process.env.DISABLE_AUTH === 'true') {
    return NextResponse.next()
  }

  return withAuth(
    function middleware(req) {
      // Add any additional middleware logic here
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  )(req as any)
}

export const config = {
  matcher: [
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|logo_light.png|logo_dark.png).*)',
  ],
}
*/ 