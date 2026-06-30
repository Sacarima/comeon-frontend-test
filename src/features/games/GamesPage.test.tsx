import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import * as api from '../../api';
import type { Category, Game } from '../../types';
import { GamesPage } from './GamesPage';

vi.mock('../../api');

const categories: Category[] = [
  { id: 0, name: 'ALL' },
  { id: 1, name: 'VIDEO SLOTS' },
  { id: 2, name: 'SLOT MACHINES' },
];

const games: Game[] = [
  {
    name: 'Festing Fox',
    description: 'Fox game',
    code: 'feastingfox',
    icon: 'images/game-icon/feasting_fox.png',
    categoryIds: [0, 2],
  },
  {
    name: 'Book Of Inferno',
    description: 'Adventure slot',
    code: 'bookofinferno94',
    icon: 'images/game-icon/book_of_inferno_logo.png',
    categoryIds: [0, 1],
  },
];

function renderGamesPage() {
  return render(
    <MemoryRouter>
      <GamesPage />
    </MemoryRouter>,
  );
}

describe('GamesPage', () => {
  beforeEach(() => {
    vi.mocked(api.getGames).mockReset();
    vi.mocked(api.getCategories).mockReset();
  });

  it('shows a loading state while games data is loading', () => {
    vi.mocked(api.getGames).mockReturnValue(new Promise(() => {}));
    vi.mocked(api.getCategories).mockReturnValue(new Promise(() => {}));

    renderGamesPage();

    expect(screen.getByText(/loading/i)).toBeVisible();
  });

  it('shows an error message when games data cannot be loaded', async () => {
    vi.mocked(api.getGames).mockRejectedValue(new Error('Failed to load games'));
    vi.mocked(api.getCategories).mockResolvedValue(categories);

    renderGamesPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load games. Please try again.',
    );
  });

  it('filters visible games by search term', async () => {
  const user = userEvent.setup();

  vi.mocked(api.getGames).mockResolvedValue(games);
  vi.mocked(api.getCategories).mockResolvedValue(categories);

  renderGamesPage();

  expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();

  await user.type(screen.getByLabelText(/search games/i), 'book');

  expect(screen.getByRole('heading', { name: /book of inferno/i })).toBeVisible();
  expect(
    screen.queryByRole('heading', { name: /festing fox/i }),
  ).not.toBeInTheDocument();
});

it('shows an empty message when search has no matches', async () => {
  const user = userEvent.setup();

  vi.mocked(api.getGames).mockResolvedValue(games);
  vi.mocked(api.getCategories).mockResolvedValue(categories);

  renderGamesPage();

  expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();

  await user.type(screen.getByLabelText(/search games/i), 'starburst');

  expect(
    screen.getByText(/no games match your search or selected category/i),
  ).toBeVisible();

  expect(
    screen.queryByRole('heading', { name: /festing fox/i }),
  ).not.toBeInTheDocument();
});

it('filters visible games by selected category', async () => {
  const user = userEvent.setup();

  vi.mocked(api.getGames).mockResolvedValue(games);
  vi.mocked(api.getCategories).mockResolvedValue(categories);

  renderGamesPage();

  expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();
  expect(screen.getByRole('heading', { name: /book of inferno/i })).toBeVisible();

  await user.click(screen.getByRole('button', { name: /video slots/i }));

  expect(screen.getByRole('heading', { name: /book of inferno/i })).toBeVisible();
  expect(
    screen.queryByRole('heading', { name: /festing fox/i }),
  ).not.toBeInTheDocument();
});

it('shows more games when load more is clicked', async () => {
  const user = userEvent.setup();

  const paginatedGames: Game[] = [
    ...games,
    {
      name: 'Warp Wreckers',
      description: 'Robot game',
      code: 'warpwreckers',
      icon: 'images/game-icon/warp_wreckers_powerglyph_logo.png',
      categoryIds: [0, 1, 2],
    },
    {
      name: "Reno 7's",
      description: 'Road trip casino game',
      code: 'renosevens',
      icon: 'images/game-icon/renoseverns_logo_one_line_shadow.png',
      categoryIds: [0, 2],
    },
    {
      name: 'Scatter Monsters',
      description: 'Festival monster game',
      code: 'scattermonsters',
      icon: 'images/game-icon/scatter-monster-logo.png',
      categoryIds: [0, 1],
    },
  ];

  vi.mocked(api.getGames).mockResolvedValue(paginatedGames);
  vi.mocked(api.getCategories).mockResolvedValue(categories);

  renderGamesPage();

  expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();
  expect(screen.getByRole('heading', { name: /book of inferno/i })).toBeVisible();
  expect(screen.getByRole('heading', { name: /warp wreckers/i })).toBeVisible();
  expect(screen.getByRole('heading', { name: /reno 7's/i })).toBeVisible();

  expect(
    screen.queryByRole('heading', { name: /scatter monsters/i }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /load more games/i }));

  expect(screen.getByRole('heading', { name: /scatter monsters/i })).toBeVisible();
});

  it('renders games and categories after successful loading', async () => {
    vi.mocked(api.getGames).mockResolvedValue(games);
    vi.mocked(api.getCategories).mockResolvedValue(categories);

    renderGamesPage();

    expect(await screen.findByRole('heading', { name: /festing fox/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /book of inferno/i })).toBeVisible();

    expect(screen.getByRole('button', { name: /all/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /video slots/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /slot machines/i })).toBeVisible();

    expect(screen.getByRole('link', { name: /play festing fox/i })).toHaveAttribute(
      'href',
      '/games/feastingfox',
    );
  });
});