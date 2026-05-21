'use client';

import { Trash2, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/context/app-store';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ConcertCardAction | null>(
    null,
  );

  const isReserved = isUserReserved(concert.id);

  const openConfirm = (action: ConcertCardAction) => {
    setPendingAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction === 'delete') {
      deleteConcert(concert.id);
      toast.success('Delete successfully');
    } else if (pendingAction === 'reserve') {
      reserveConcert(concert.id, 'Sara John');
      toast.success('Reserve successfully');
    } else if (pendingAction === 'cancel') {
      cancelReservation(concert.id, 'Sara John');
      toast.success('Cancel successfully');
    }

    setDialogOpen(false);
    setPendingAction(null);
  };

  const dialogContent = () => {
    if (pendingAction === 'delete') {
      return (
        <>
          Are you sure to delete? &apos;
          <span className="font-semibold text-gray-900">{concert.name}</span>
          &apos;
        </>
      );
    }
    if (pendingAction === 'reserve') {
      return (
        <>
          Are you sure to reserve? &apos;
          <span className="font-semibold text-gray-900">{concert.name}</span>
          &apos;
        </>
      );
    }
    return (
      <>
        Are you sure to cancel? &apos;
        <span className="font-semibold text-gray-900">{concert.name}</span>
        &apos;
      </>
    );
  };

  const confirmLabel =
    pendingAction === 'delete' ? 'Yes, Delete' : 'Yes, Confirm';

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
              className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : isReserved ? (
            <button
              type="button"
              onClick={() => openConfirm('cancel')}
              className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openConfirm('reserve')}
              className="rounded-lg bg-[#2196F3] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Reserve
            </button>
          )}
        </div>
      </article>

      <ConfirmDialog
        open={dialogOpen}
        title="Confirmation"
        message={dialogContent()}
        confirmLabel={confirmLabel}
        onConfirm={handleConfirm}
        onCancel={() => {
          setDialogOpen(false);
          setPendingAction(null);
        }}
      />
    </>
  );
};
