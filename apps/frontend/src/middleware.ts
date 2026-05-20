import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // TODO: implement route protection based on JWT token and user role
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/concerts/:path*',
  ],
};
