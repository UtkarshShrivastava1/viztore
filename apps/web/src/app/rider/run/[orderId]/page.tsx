import { Metadata } from 'next';
import { RiderRunClient } from './RiderRunClient';
import { branding } from '@repo/shared-types';

interface PageProps {
  params: {
    orderId: string;
  };
}

export const metadata: Metadata = {
  title: `Delivery Run Portal | ${branding.appName}`,
  description: 'Hyperlocal rider delivery portal for instant run claiming, turn-by-turn navigation, and doorstep OTP verification.',
};

export default function RiderRunPage({ params }: PageProps) {
  return <RiderRunClient orderId={params.orderId} />;
}
