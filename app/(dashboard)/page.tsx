'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/barber');
      }
    }
  }, [role, isLoading, router]);

  return null;
}
