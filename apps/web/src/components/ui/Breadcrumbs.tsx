import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="hidden lg:flex items-center text-[12.5px] font-medium text-[#475569] mb-4 select-none">
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[#1668F6] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[#061842] font-bold" : ""}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
