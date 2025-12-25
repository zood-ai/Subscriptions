import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  // this if statment is important because in matcher i did include everything
  // ['/:path*'] so even the css is included
  // then if you remove this if statment the css will break
  // 💀⚠️
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  // 💀⚠️

  if (!token) {
    if (pathname === '/login') return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname === '/manage-business') {
    return NextResponse.redirect(
      new URL('/manage-business/business', request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
