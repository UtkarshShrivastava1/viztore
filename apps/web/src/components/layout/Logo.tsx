import Image from "next/image";
import Link from "next/link";
import { branding } from '@repo/shared-types';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}

export default function Logo({ 
  theme = 'light',
  className = '',
  imgClassName = '',
  width = 160,
  height = 54,
}: LogoProps) {
  const isDarkTheme = theme === 'dark';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || branding.appName;
  // Dark theme parameter means dark wordmark for light/white surfaces
  // Default light theme means white wordmark for dark navy (#011A5D) headers
  const logoSrc = isDarkTheme ? '/images/logo-dark.png' : '/images/logo-white.png';
  
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center select-none hover:opacity-90 transition-opacity shrink-0 ${className}`}
      aria-label={`${appName} - ${branding.tagline}`}
    >
      <Image
        src={logoSrc}
        alt={appName}
        width={width}
        height={height}
        className={imgClassName || "h-10 sm:h-11 md:h-12 w-auto object-contain"}
        priority
      />
    </Link>
  );
}
