import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { LoginForm } from '@/components/auth/login/login-form';

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
