import { describe, expect, it } from 'vitest';

import type { Game } from '../../types';
import { filterGames } from './filterGames';

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
  {
    name: 'Warp Wreckers',
    description: 'Robot game',
    code: 'warpwreckers',
    icon: 'images/game-icon/warp_wreckers_powerglyph_logo.png',
    categoryIds: [0, 1, 2],
  },
];

describe('filterGames', () => {
  it('returns all games when search and category are empty', () => {
    const result = filterGames({
      games,
      searchTerm: '',
      selectedCategoryId: null,
    });

    expect(result).toEqual(games);
  });

  it('filters games by search term', () => {
    const result = filterGames({
      games,
      searchTerm: 'book',
      selectedCategoryId: null,
    });

    expect(result).toEqual([games[1]]);
  });

  it('filters games case-insensitively and trims whitespace', () => {
    const result = filterGames({
      games,
      searchTerm: '  WARP  ',
      selectedCategoryId: null,
    });

    expect(result).toEqual([games[2]]);
  });

  it('filters games by selected category', () => {
    const result = filterGames({
      games,
      searchTerm: '',
      selectedCategoryId: 2,
    });

    expect(result).toEqual([games[0], games[2]]);
  });

  it('filters by search term and category together', () => {
    const result = filterGames({
      games,
      searchTerm: 'warp',
      selectedCategoryId: 1,
    });

    expect(result).toEqual([games[2]]);
  });

  it('returns an empty array when no games match', () => {
    const result = filterGames({
      games,
      searchTerm: 'starburst',
      selectedCategoryId: null,
    });

    expect(result).toEqual([]);
  });
});