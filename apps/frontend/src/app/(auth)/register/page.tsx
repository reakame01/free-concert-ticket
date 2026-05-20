import { AccessModeBadge } from '@/components/auth/access-mode-badge';

export default function RegisterPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
      <p className="mt-2 text-gray-500">
        Create an account for your selected access level.
      </p>
      <div className="mt-6">
        <AccessModeBadge />
      </div>
      {/* TODO: register form — use getSignupRoleFromStorage() for account role */}
    </main>
  );
}
