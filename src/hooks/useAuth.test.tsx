import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { useAuth } from './useAuth';

function TestConsumer() {
  const { player, isLoggingIn } = useAuth();

  return (
    <div>
      <p>{player?.name ?? 'No player'}</p>
      <p>{isLoggingIn ? 'Logging in' : 'Idle'}</p>
    </div>
  );
}

const authValue: AuthContextValue = {
  player: {
    name: 'Rebecka Awesome',
    avatar: 'images/avatar/rebecka.jpg',
    event: 'Last seen gambling on Starburst.',
  },
  loginError: undefined,
  isLoggingIn: false,
  isLoggingOut: false,
  login: vi.fn(),
  logout: vi.fn(),
};

describe('useAuth', () => {
  it('returns the auth context value when used inside AuthProvider', () => {
    render(
      <AuthContext.Provider value={authValue}>
        <TestConsumer />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Rebecka Awesome')).toBeVisible();
    expect(screen.getByText('Idle')).toBeVisible();
  });

  it('throws when used outside AuthProvider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used inside AuthProvider',
    );
  });
});