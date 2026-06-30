import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../context/AuthContext';

import * as api from '../../api';
import type { Game } from '../../types';
import { GamePlayPage } from './GamePlayPage';

vi.mock('../../api');

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

const games: Game[] = [
  {
    name: 'Festing Fox',
    description: 'Fox game',
    code: 'feastingfox',
    icon: 'images/game-icon/feasting_fox.png',
    categoryIds: [0, 2],
  },
];

function renderGamePlayPage(initialPath = '/games/feastingfox') {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/games/:gameCode" element={<GamePlayPage />} />
          <Route path="/" element={<h1>Home page</h1>} />
          <Route path="/lobby" element={<h1>Lobby page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
describe('GamePlayPage', () => {
  beforeEach(() => {
    vi.mocked(api.getGames).mockReset();
    document.body.innerHTML = '';
    delete (globalThis as { comeon?: unknown }).comeon;
  });

  it('loads the selected game and launches it', async () => {
    const launch = vi.fn();

    vi.mocked(api.getGames).mockResolvedValue(games);

    (globalThis as typeof globalThis & {
      comeon: { game: { launch: typeof launch } };
    }).comeon = {
      game: {
        launch,
      },
    };

    renderGamePlayPage();

    expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();

    await waitFor(() => {
      expect(launch).toHaveBeenCalledWith('feastingfox');
    });
  });

  it('shows a fallback when the game launcher is unavailable', async () => {
    vi.mocked(api.getGames).mockResolvedValue(games);

    renderGamePlayPage();

    expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();

    expect(await screen.findByText(/game launcher unavailable/i)).toBeVisible();
  });

  it('shows an error when the selected game cannot be loaded', async () => {
    vi.mocked(api.getGames).mockRejectedValue(new Error('Failed to load'));

    renderGamePlayPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load the selected game. Please try again.',
    );
  });
});