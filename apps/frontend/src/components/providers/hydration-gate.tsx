'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '@/context/i18n-provider';
import { AppLoader } from '@/components/ui/app-loader';

interface HydrationGateProps {
  children: ReactNode;
}

let hasCompletedInitialHydration = false;

export const HydrationGate = ({ children }: HydrationGateProps) => {
  const { t } = useI18n();
  const [overlayVisible, setOverlayVisible] = useState(
    () => !hasCompletedInitialHydration,
  );
  const [fadeOut, setFadeOut] = useState(hasCompletedInitialHydration);

  useEffect(() => {
    if (hasCompletedInitialHydration) {
      return;
    }

    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setFadeOut(true));
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (fadeOut) {
      hasCompletedInitialHydration = true;
      setOverlayVisible(false);
    }
  };

  return (
    <>
      {children}
      {overlayVisible && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-page/95 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-busy={!fadeOut}
          onTransitionEnd={handleTransitionEnd}
        >
          <AppLoader message={t('common.appLoading')} />
        </div>
      )}
    </>
  );
};

