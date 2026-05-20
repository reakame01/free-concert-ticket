import { LandingHeader } from '@/components/landing/landing-header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-page text-gray-900">
      <LandingHeader />
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
