import { useState } from 'react';

import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import type { RegisterFormValues } from '../schemas/auth';

// WIP: This page is not fully implemented yet. The registration form is mocked and does not call any API.
export function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(values: RegisterFormValues) {
    setIsSubmitting(true);

    try {
      console.log('Register values:', values);
      // Mock registration for now.
      // Later this can call a real register API but out of scope for now.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Quick registration"
      switchLabel="Log in"
      switchTo="/login"
    >
      <RegisterForm
        onSubmit={handleRegister}
        isSubmitting={isSubmitting}
      />
    </AuthLayout>
  );
}