import type { ReactNode } from 'react';
import { AuthBrandPanel } from './auth-brand-panel';

interface AuthSplitLayoutProps {
  children: ReactNode;
}

export const AuthSplitLayout = ({ children }: AuthSplitLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <AuthBrandPanel />

      <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        {children}
      </section>
    </div>
  );
};
