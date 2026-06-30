import { LoginForm } from '../components/auth/LoginForm';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const auth = useAuth();

  return (
    <AuthLayout
      title="Login"
      switchLabel="Open an account"
      switchTo="/register"
    >
      <LoginForm
        onSubmit={auth.login}
        isSubmitting={auth.isLoggingIn}
        apiError={auth.loginError}
      />

    </AuthLayout>
  );
}