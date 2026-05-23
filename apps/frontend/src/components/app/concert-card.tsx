'use client';

import { Loader2, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/context/app-store';
import { useI18n } from '@/context/i18n-provider';
import { getApiErrorMessage } from '@/lib/api-error';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Concert } from '@/types/concert';
import type { ConcertCardAction } from '@/types/concert';

interface ConcertCardProps {
  concert: Concert;
  mode: 'admin' | 'user';
}

export const ConcertCard = ({ concert, mode }: ConcertCardProps) => {
  const { deleteConcert, reserveConcert, cancelReservation, isUserReserved } =
    useAppStore();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ConcertCardAction | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReserved = isUserReserved(concert.id);

  const openConfirm = (action: ConcertCardAction) => {
    if (isSubmitting) return;
    setPendingAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (pendingAction === 'delete') {
        await deleteConcert(concert.id);
        toast.success(t('toast.deleteSuccess'));
      } else if (pendingAction === 'reserve') {
        await reserveConcert(concert.id);
        toast.success(t('toast.reserveSuccess'));
      } else if (pendingAction === 'cancel') {
        await cancelReservation(concert.id);
        toast.success(t('toast.cancelSuccess'));
      }
      setDialogOpen(false);
      setPendingAction(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('toast.actionFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = () => {
    const prefix =
      pendingAction === 'delete'
        ? t('concert.confirmDelete')
        : pendingAction === 'reserve'
          ? t('concert.confirmReserve')
          : t('concert.confirmCancel');

    return (
      <>
        {prefix} &apos;
        <span className="font-semibold text-gray-900">{concert.name}</span>
        &apos;
      </>
    );
  };

  const confirmLabel =
    pendingAction === 'delete'
      ? t('common.yesDelete')
      : t('common.yesConfirm');

  const actionButtonDisabled = isSubmitting;

  return (
    <>
      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#2196F3]">{concert.name}</h3>
        <hr className="my-4 border-gray-200" />
        <p className="text-sm leading-relaxed text-gray-600">
          {concert.description}
        </p>
        <div className="mt-6 flex items-end justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
            <span className="text-lg font-semibold">
              {concert.totalSeats.toLocaleString()}
            </span>
          </div>

          {mode === 'admin' ? (
            <button
              type="button"
              onClick={() => openConfirm('delete')}
              disabled={actionButtonDisabled}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {t('concert.delete')}
            </button>
          ) : isReserved ? (
            <button
              type="button"
              onClick={() => openConfirm('cancel')}
              disabled={actionButtonDisabled}
              className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('concert.cancel')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openConfirm('reserve')}
              disabled={actionButtonDisabled}
              className="rounded-lg bg-[#2196F3] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('concert.reserve')}
            </button>
          )}
        </div>
      </article>

      <ConfirmDialog
        open={dialogOpen}
        title={t('common.confirmation')}
        message={dialogContent()}
        confirmLabel={
          isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.processing')}
            </span>
          ) : (
            confirmLabel
          )
        }
        cancelLabel={t('common.cancel')}
        confirmDisabled={isSubmitting}
        onConfirm={() => void handleConfirm()}
        onCancel={() => {
          if (isSubmitting) return;
          setDialogOpen(false);
          setPendingAction(null);
        }}
      />
    </>
  );
};
