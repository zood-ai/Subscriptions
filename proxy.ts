import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (request.nextUrl.pathname === '/manage-business') {
    return NextResponse.redirect(
      new URL('/manage-business/business', request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/manage-business'],
};
