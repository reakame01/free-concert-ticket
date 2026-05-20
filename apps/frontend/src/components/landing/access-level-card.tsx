'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { setAccessMode } from '@/lib/access-mode';
import type { AccessMode } from '@/types/access-mode';

interface AccessLevelCardProps {
  variant: 'user' | 'admin';
  accessMode: AccessMode;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  icon: ReactNode;
}

export const AccessLevelCard = ({
  variant,
  accessMode,
  title,
  description,
  buttonLabel,
  href,
  icon,
}: AccessLevelCardProps) => {
  const router = useRouter();
  const isAdmin = variant === 'admin';

  const handleEnter = () => {
    setAccessMode(accessMode);
    router.push(href);
  };

  const cardClassName = isAdmin
    ? 'flex min-h-[48vh] flex-col justify-between rounded-2xl bg-brand p-10 text-white shadow-lg sm:min-h-[55vh] sm:p-12 md:min-h-[60vh] lg:p-14'
    : 'flex min-h-[48vh] flex-col justify-between rounded-2xl bg-white p-10 text-gray-900 shadow-md ring-1 ring-gray-100 sm:min-h-[55vh] sm:p-12 md:min-h-[60vh] lg:p-14';

  const iconWrapClassName = isAdmin
    ? 'mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 sm:h-24 sm:w-24'
    : 'mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-light sm:h-24 sm:w-24';

  const iconClassName = isAdmin ? 'text-white' : 'text-brand';

  const titleClassName = isAdmin
    ? 'mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-[2.5rem]'
    : 'mb-5 text-3xl font-bold text-brand sm:text-4xl lg:text-[2.5rem]';

  const descriptionClassName = isAdmin
    ? 'max-w-md text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl'
    : 'max-w-md text-base leading-relaxed text-gray-500 sm:text-lg lg:text-xl';

  const buttonClassName = isAdmin
    ? 'mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand transition-colors hover:bg-brand-light sm:py-5 sm:text-lg'
    : 'mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-dark sm:py-5 sm:text-lg';

  return (
    <article className={cardClassName}>
      <div>
        <div className={iconWrapClassName} aria-hidden="true">
          <div className={iconClassName}>{icon}</div>
        </div>

        <h2 className={titleClassName}>{title}</h2>

        <p className={descriptionClassName}>{description}</p>
      </div>

      <button type="button" onClick={handleEnter} className={buttonClassName}>
        {buttonLabel}
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </button>
    </article>
  );
};
