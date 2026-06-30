import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiEye, FiEyeOff, FiGift } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import {
  registerSchema,
  type RegisterFormValues,
} from '../../schemas/auth';

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => void;
  isSubmitting?: boolean;
};

export function RegisterForm({
  onSubmit,
  isSubmitting = false,
}: RegisterFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      phonePrefix: '+48',
      marketingAccepted: false,
    },
  });

  const emailField = register('email');
  const phonePrefixField = register('phonePrefix');
  const phoneNumberField = register('phoneNumber');
  const passwordField = register('password');
  const termsAcceptedField = register('termsAccepted');
  const marketingAcceptedField = register('marketingAccepted');

  return (
    <>
      <div className="register-promo">
        <FiGift className="register-promo-icon" aria-hidden="true" />
        <span>
          Create an account and receive PLN 250 risk-free + PLN 50 FREEBET!
        </span>
      </div>

      <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="form-field register-field">
          <span className="sr-only">Email address</span>
          <input
            {...emailField}
            type="email"
            placeholder="Email address"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            onChange={(event) => {
              emailField.onChange(event);
              clearErrors('email');
            }}
          />

          {errors.email ? (
            <FiAlertCircle className="field-error-icon" aria-hidden="true" />
          ) : null}
        </label>

        {errors.email ? (
          <p id="register-email-error" className="field-error" role="alert">
            {errors.email.message}
          </p>
        ) : null}

  <div className="register-row">
  <div className="register-field-group">
    <label className="form-field register-field">
      <span className="sr-only">Directional</span>
      <input
        {...phonePrefixField}
        className="register-country-code"
        type="text"
        placeholder="Directional"
        aria-invalid={Boolean(errors.phonePrefix)}
        aria-describedby={
          errors.phonePrefix ? 'register-prefix-error' : undefined
        }
        onChange={(event) => {
          phonePrefixField.onChange(event);
          clearErrors('phonePrefix');
        }}
      />

      {errors.phonePrefix ? (
        <FiAlertCircle className="field-error-icon" aria-hidden="true" />
      ) : null}
    </label>

    {errors.phonePrefix ? (
      <p id="register-prefix-error" className="field-error" role="alert">
        {errors.phonePrefix.message}
      </p>
    ) : null}
  </div>

    <div className="register-field-group">
        <label className="form-field register-field">
        <span className="sr-only">Phone number</span>
        <input
            {...phoneNumberField}
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={
            errors.phoneNumber ? 'register-phone-error' : undefined
            }
            onChange={(event) => {
            phoneNumberField.onChange(event);
            clearErrors('phoneNumber');
            }}
        />

        {errors.phoneNumber ? (
            <FiAlertCircle className="field-error-icon" aria-hidden="true" />
        ) : null}
        </label>

        {errors.phoneNumber ? (
        <p id="register-phone-error" className="field-error" role="alert">
            {errors.phoneNumber.message}
        </p>
        ) : null}
    </div>
    </div>

        <label className="form-field register-field floating-field password-field">
          <input
            {...passwordField}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder=" "
            autoComplete="new-password"
            aria-label="Password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'register-password-error' : undefined
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
        <ul id="register-password-error" className="password-rules" role="alert">
            {[
            'Other than email',
            'One special character',
            'One digit',
            '8-15 characters',
            ].map((message) => (
            <li key={message}>{message}</li>
            ))}
        </ul>
        ) : null}

        <label className="checkbox-field register-checkbox">
          <input
            {...termsAcceptedField}
            type="checkbox"
            aria-invalid={Boolean(errors.termsAccepted)}
            aria-describedby={
              errors.termsAccepted ? 'register-terms-error' : undefined
            }
            onChange={(event) => {
              termsAcceptedField.onChange(event);
              clearErrors('termsAccepted');
            }}
          />
          <span>
            Check the box to consent to the processing of your personal data
            under the terms set out in the{' '}
            <Link to="#">Privacy Policy</Link>, in accordance with the Act and
            the GDPR.
          </span>
        </label>

        {errors.termsAccepted ? (
          <p id="register-terms-error" className="field-error" role="alert">
            {errors.termsAccepted.message}
          </p>
        ) : null}

        <label className="checkbox-field register-checkbox">
          <input {...marketingAcceptedField} type="checkbox" />
          <span>
            Tick to receive information about free bets, bonuses, special offers
            and other commercial information.
          </span>
        </label>

        <button
          type="submit"
          className="button button-primary register-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Quick registration'}
        </button>
      </form>
    </>
  );
}