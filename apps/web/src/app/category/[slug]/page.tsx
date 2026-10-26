import React from 'react';
import type { Metadata } from 'next';
import { CategoryPlpClient } from './CategoryPlpClient';
import { branding } from '@repo/shared-types';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const formattedCategory = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedCategory} Products — ${branding.appName}`,
    description: `Shop trending ${formattedCategory} collections with instant hyperlocal delivery from verified local stores on ${branding.appName}.`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryPlpClient slug={params.slug} />;
}
