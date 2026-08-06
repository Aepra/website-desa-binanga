import React from 'react';
import { getLayananByIdUser } from '@/server/actions/user-dashboard.action';
import { notFound } from 'next/navigation';
import UserLayananDetailClient from './UserLayananDetailClient';
import { getSession } from '@/lib/auth';

export default async function UserLayananDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getLayananByIdUser(resolvedParams.id);
  const session = await getSession();
  
  if (!item || !session) {
    return notFound();
  }

  return <UserLayananDetailClient item={item} role={session.role || 'WARGA'} />;
}
