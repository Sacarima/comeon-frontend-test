import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginFormValues } from '../../schemas/auth';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
  apiError?: string;
};

export function LoginForm({
  onSubmit,
  isSubmitting = false,
  apiError,
}: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const usernameField = register('username');
  const passwordField = register('password');

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="form-field floating-field">
        <input
          {...usernameField}
          type="text"
          placeholder=" "
          autoComplete="username"
          aria-label="Username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'username-error' : undefined}
          onChange={(event) => {
            usernameField.onChange(event);
            clearErrors('username');
          }}
        />
        <span>Username</span>

        {errors.username ? (
          <FiAlertCircle className="field-error-icon" aria-hidden="true" />
        ) : null}
      </label>

      {errors.username ? (
        <p id="username-error" className="field-error" role="alert">
          {errors.username.message}
        </p>
      ) : null}

      <label className="form-field floating-field password-field">
        <input
          {...passwordField}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder=" "
          autoComplete="current-password"
          aria-label="Password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? 'password-error' : undefined
          }
          onChange={(event) => {
            passwordField.onChange(event);
            clearErrors('password');
          }}
        />
        <span>Password</span>

        <button
          type="button"
          className="password-toggle"
          onClick={() => setIsPasswordVisible((current) => !current)}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? (
            <FiEye aria-hidden="true" />
          ) : (
            <FiEyeOff aria-hidden="true" />
          )}
        </button>
      </label>

      {errors.password ? (
        <p id="password-error" className="field-error" role="alert">
          {errors.password?.message}
        </p>
      ) : null}

      {apiError ? (
        <p className="form-error" role="alert">
          {apiError}
        </p>
      ) : null}

      <button
        type="submit"
        className="button button-primary login-submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <a className="auth-link" href="#forgot-password">
        Forgot your password?
      </a>
    </form>
  );
}