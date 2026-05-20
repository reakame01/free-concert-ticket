'use client';

import { useEffect, useState } from 'react';
import { getAccessMode } from '@/lib/access-mode';
import type { AccessMode } from '@/types/access-mode';

const MODE_LABELS: Record<AccessMode, string> = {
  USER: 'User (Client)',
  ADMIN: 'Administrator',
};

export const AccessModeBadge = () => {
  const [mode, setMode] = useState<AccessMode | null>(null);

  useEffect(() => {
    setMode(getAccessMode());
  }, []);

  if (!mode) {
    return (
      <p className="text-sm text-amber-600">
        No access mode selected. Please return to the{' '}
        <a href="/" className="font-medium underline">
          home page
        </a>{' '}
        and choose User or Administrator.
      </p>
    );
  }

  return (
    <p className="rounded-lg bg-brand-light px-4 py-2 text-sm text-brand">
      Selected mode: <strong>{MODE_LABELS[mode]}</strong>
    </p>
  );
};
