import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as api from '../api';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from './AuthProvider';

vi.mock('../api');

const player = {
  name: 'Rebecka Awesome',
  avatar: 'images/avatar/rebecka.jpg',
  event: 'Last seen gambling on Starburst.',
};

const loginValues = {
  username: 'rebecka',
  password: 'secret',
};

function AuthConsumer() {
  const { player, loginError, login, logout } = useAuth();

  return (
    <div>
      <p>{player ? player.name : 'No player'}</p>

      {loginError ? <p role="alert">{loginError}</p> : null}

      <button type="button" onClick={() => void login(loginValues)}>
        Log in
      </button>

      <button type="button" onClick={() => void logout()}>
        Log out
      </button>
    </div>
  );
}

function renderAuthProvider() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>,
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(api.login).mockReset();
    vi.mocked(api.logout).mockReset();
  });

  it('starts without an authenticated player when localStorage is empty', () => {
    renderAuthProvider();

    expect(screen.getByText('No player')).toBeVisible();
  });

  it('restores an authenticated session from localStorage', () => {
    localStorage.setItem(
      'comeon-auth-session',
      JSON.stringify({
        username: 'rebecka',
        player,
      }),
    );

    renderAuthProvider();

    expect(screen.getByText('Rebecka Awesome')).toBeVisible();
  });

  it('logs in successfully and stores the session', async () => {
    const user = userEvent.setup();

    vi.mocked(api.login).mockResolvedValue({
      status: 'success',
      player,
    });

    renderAuthProvider();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Rebecka Awesome')).toBeVisible();

    expect(api.login).toHaveBeenCalledWith(loginValues);

    expect(JSON.parse(localStorage.getItem('comeon-auth-session') ?? '')).toEqual({
      username: 'rebecka',
      player,
    });
  });

  it('shows a login error and does not store a session when login fails', async () => {
    const user = userEvent.setup();

    vi.mocked(api.login).mockRejectedValue({
      message: 'Something went wrong. Please try again.',
      status: 400,
    });

    renderAuthProvider();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid username or password',
    );

    expect(screen.getByText('No player')).toBeVisible();
    expect(localStorage.getItem('comeon-auth-session')).toBeNull();
  });

  it('logs out and removes the stored session', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'comeon-auth-session',
      JSON.stringify({
        username: 'rebecka',
        player,
      }),
    );

    vi.mocked(api.logout).mockResolvedValue({
      status: 'success',
    });

    renderAuthProvider();

    expect(screen.getByText('Rebecka Awesome')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => {
      expect(screen.getByText('No player')).toBeVisible();
    });

    expect(api.logout).toHaveBeenCalledWith('rebecka');
    expect(localStorage.getItem('comeon-auth-session')).toBeNull();
  });

  it('clears the local session even when logout request fails', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'comeon-auth-session',
      JSON.stringify({
        username: 'rebecka',
        player,
      }),
    );

    vi.mocked(api.logout).mockRejectedValue({
      message: 'Something went wrong. Please try again.',
      status: 500,
    });

    renderAuthProvider();

    expect(screen.getByText('Rebecka Awesome')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => {
      expect(screen.getByText('No player')).toBeVisible();
    });

    expect(api.logout).toHaveBeenCalledWith('rebecka');
    expect(localStorage.getItem('comeon-auth-session')).toBeNull();
  });
});