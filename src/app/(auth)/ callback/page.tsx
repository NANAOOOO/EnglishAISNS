'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace('/'), 300);
    return () => clearTimeout(t);
  }, [router]);
  return <p className="p-6">Signing you in…</p>;
}
