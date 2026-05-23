'use client';

import { Check } from 'lucide-react';
import { useI18n } from '@/context/i18n-provider';

interface SuccessDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const SuccessDialog = ({
  open,
  title,
  message,
  onClose,
}: SuccessDialogProps) => {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Check className="h-7 w-7 text-green-600" strokeWidth={2} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          {t('common.ok')}
        </button>
      </div>
    </div>
  );
};
