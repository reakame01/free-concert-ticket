'use client';

import { Award, User, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppStore } from '@/context/app-store';

interface StatCardProps {
  label: string;
  value: number;
  bgColor: string;
  icon: ReactNode;
}

const StatCard = ({ label, value, bgColor, icon }: StatCardProps) => {
  return (
    <div
      className="flex min-h-[180px] flex-col items-center justify-center rounded-xl px-8 py-2 text-center text-white shadow-sm sm:min-h-[200px]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-4 text-white">{icon}</div>
      <p className="text-base font-medium text-white">{label}</p>
      <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export const StatCards = () => {
  const { totalSeats, totalReserved, totalCancelled } = useAppStore();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
      <StatCard
        label="Total of seats"
        value={totalSeats}
        bgColor="#0070A4"
        icon={<User className="h-14 w-14 sm:h-16 sm:w-16" strokeWidth={1.5} />}
      />
      <StatCard
        label="Reserve"
        value={totalReserved}
        bgColor="#00A58B"
        icon={<Award className="h-14 w-14 sm:h-16 sm:w-16" strokeWidth={1.5} />}
      />
      <StatCard
        label="Cancel"
        value={totalCancelled}
        bgColor="#F96464"
        icon={<XCircle className="h-14 w-14 sm:h-16 sm:w-16" strokeWidth={1.5} />}
      />
    </div>
  );
};
