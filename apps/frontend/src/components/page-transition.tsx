'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 16 };

  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  const exit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -10 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
