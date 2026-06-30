import type { Game } from '../../types';

type FilterGamesParams = {
  games: Game[];
  searchTerm: string;
  selectedCategoryId: number | null;
};

export function filterGames({
  games,
  searchTerm,
  selectedCategoryId,
}: FilterGamesParams): Game[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return games.filter((game) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      game.name.toLowerCase().includes(normalizedSearchTerm);

    const matchesCategory =
      selectedCategoryId === null || game.categoryIds.includes(selectedCategoryId);

    return matchesSearch && matchesCategory;
  });
}

