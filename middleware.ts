import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah pengunjung punya tiket (cookie)
  const session = request.cookies.get('teacher_session');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Jika tidak punya tiket dan BUKAN sedang di halaman login -> Usir ke /login
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah punya tiket tapi mencoba buka halaman login -> Arahkan langsung ke /
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Lolos pengecekan, silakan masuk
  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga oleh satpam (kecuali file statis/gambar)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|Lambang-UM.png).*)'],
};