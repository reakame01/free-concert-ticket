import { AccessModeBadge } from '@/components/auth/access-mode-badge';

export default function LoginPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-900">Login</h1>
      <p className="mt-2 text-gray-500">
        Sign in to continue to your selected workspace.
      </p>
      <div className="mt-6">
        <AccessModeBadge />
      </div>
      {/* TODO: login form — use getPostLoginPathFromStorage() after success */}
    </main>
  );
}
