import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

const anonymousAuthValue: AuthContextValue = {
  player: null,
  loginError: undefined,
  isLoggingIn: false,
  isLoggingOut: false,
  login: vi.fn(),
  logout: vi.fn(),
};

const authenticatedAuthValue: AuthContextValue = {
  ...anonymousAuthValue,
  player: {
    name: 'Rebecka Awesome',
    avatar: 'images/avatar/rebecka.jpg',
    event: 'Last seen gambling on Starburst.',
  },
};

function renderWithAuth({
  authValue,
  initialPath,
}: {
  authValue: AuthContextValue;
  initialPath: string;
}) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/lobby"
            element={
              <ProtectedRoute>
                <h1>Lobby page</h1>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <h1>Login page</h1>
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('route guards', () => {
  it('redirects anonymous users away from protected routes', () => {
    renderWithAuth({
      authValue: anonymousAuthValue,
      initialPath: '/lobby',
    });

    expect(screen.getByRole('heading', { name: /login page/i })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /lobby page/i })).not.toBeInTheDocument();
  });

  it('allows authenticated users to access protected routes', () => {
    renderWithAuth({
      authValue: authenticatedAuthValue,
      initialPath: '/lobby',
    });

    expect(screen.getByRole('heading', { name: /lobby page/i })).toBeVisible();
  });

  it('allows anonymous users to access public-only routes', () => {
    renderWithAuth({
      authValue: anonymousAuthValue,
      initialPath: '/login',
    });

    expect(screen.getByRole('heading', { name: /login page/i })).toBeVisible();
  });

  it('redirects authenticated users away from public-only routes', () => {
    renderWithAuth({
      authValue: authenticatedAuthValue,
      initialPath: '/login',
    });

    expect(screen.getByRole('heading', { name: /lobby page/i })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /login page/i })).not.toBeInTheDocument();
  });
});