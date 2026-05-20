import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { RegisterForm } from '@/components/auth/register/register-form';

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
