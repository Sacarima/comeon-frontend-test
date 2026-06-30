import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /^log in$/i }));

    const alerts = await screen.findAllByRole('alert');

    expect(alerts.length).toBeGreaterThanOrEqual(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid login values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/username/i, { selector: 'input' }),
      'rebecka',
    );

    await user.type(
      screen.getByLabelText(/^password$/i, { selector: 'input' }),
      'secret',
    );

    await user.click(screen.getByRole('button', { name: /^log in$/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        username: 'rebecka',
        password: 'secret',
      },
      expect.anything(),
    );
  });

  it('shows the api error message', () => {
    render(
      <LoginForm
        onSubmit={vi.fn()}
        apiError="Invalid email or password"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    );
  });

  it('disables submit button while submitting', () => {
    render(<LoginForm onSubmit={vi.fn()} isSubmitting />);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/^password$/i, {
      selector: 'input',
    });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});