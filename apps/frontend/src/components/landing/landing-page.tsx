'use client';

import { MessageCircle, UserCog } from 'lucide-react';
import { useI18n } from '@/context/i18n-provider';
import { AccessLevelCard } from '@/components/landing/access-level-card';
import { LandingHeader } from '@/components/landing/landing-header';

export const LandingPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-page text-gray-900">
      <LandingHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <section className="mx-auto max-w-2xl pt-1 pb-5 text-center sm:pt-2 sm:pb-6 lg:pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {t('landing.title')}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-gray-500 sm:text-lg">
            {t('landing.subtitle')}
          </p>
        </section>

        <section
          className="mx-auto grid w-full grid-cols-1 items-start gap-6 sm:gap-8 md:grid-cols-2 md:gap-10"
          aria-label={t('landing.accessOptionsAria')}
        >
          <AccessLevelCard
            variant="user"
            accessMode="USER"
            title={t('landing.user.title')}
            description={t('landing.user.description')}
            buttonLabel={t('landing.user.button')}
            href="/login"
            icon={
              <MessageCircle
                className="h-10 w-10 sm:h-12 sm:w-12"
                strokeWidth={1.5}
              />
            }
          />

          <AccessLevelCard
            variant="admin"
            accessMode="ADMIN"
            title={t('landing.admin.title')}
            description={t('landing.admin.description')}
            buttonLabel={t('landing.admin.button')}
            href="/login"
            icon={
              <UserCog className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
            }
          />
        </section>
      </main>
    </div>
  );
};
