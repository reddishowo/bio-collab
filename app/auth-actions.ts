'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Fungsi Login
export async function loginTeacher(formData: FormData) {
  const password = formData.get('password');
  const truePassword = process.env.TEACHER_PASSWORD;

  if (password === truePassword) {
    const cookieStore = await cookies();
    
    // Set cookie yang berlaku selama 1 hari (aman dari akses Javascript client)
    cookieStore.set('teacher_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari dalam detik
      path: '/',
    });
    
    redirect('/'); // Alihkan ke Dashboard
  }

  // Jika salah, kembalikan pesan error
  return { error: 'Password salah! Akses ditolak.' };
}

// Fungsi Logout
export async function logoutTeacher() {
  const cookieStore = await cookies();
  cookieStore.delete('teacher_session');
  redirect('/login');
}