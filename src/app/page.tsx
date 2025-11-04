'use client';
import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    } else {
      redirect('/login');
    }
  }, [user]);

  return null;
}
