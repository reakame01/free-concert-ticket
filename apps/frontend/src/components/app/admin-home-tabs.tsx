'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminHomeTabs = () => {
  const pathname = usePathname();
  const isCreate = pathname === '/home/create';

  return (
    <div className="mt-8 flex gap-8 border-b border-gray-200">
      <Link
        href="/home"
        className={`pb-3 text-sm font-semibold transition-colors ${
          !isCreate
            ? 'border-b-2 border-brand text-brand'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Overview
      </Link>
      <Link
        href="/home/create"
        className={`pb-3 text-sm font-semibold transition-colors ${
          isCreate
            ? 'border-b-2 border-brand text-brand'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Create
      </Link>
    </div>
  );
};
