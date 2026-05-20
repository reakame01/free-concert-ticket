import { AuthBrandContent } from './auth-brand-content';
import { AuthLogo } from './auth-logo';

export const AuthBrandPanel = () => {
  return (
    <aside className="flex min-h-[240px] w-full flex-col justify-between bg-brand p-8 text-white sm:min-h-[280px] sm:p-10 lg:min-h-screen lg:w-1/2 lg:p-12 xl:p-16">
      <AuthLogo variant="light" />
      <AuthBrandContent />
    </aside>
  );
};
