import React from 'react';
import { getLayananByIdAdmin } from '@/server/actions/user-dashboard.action';
import { notFound } from 'next/navigation';
import LayananDetailClient from './LayananDetailClient';

export default async function AdminLayananDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await getLayananByIdAdmin(resolvedParams.id);
  
  if (!item) {
    return notFound();
  }

  return <LayananDetailClient item={item} />;
}
