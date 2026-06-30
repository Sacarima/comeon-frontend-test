import type { Game } from '../../types';
import { GameCard } from './GameCard';

type GamesGridProps = {
  games: Game[];
};

export function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="games-grid">
      {games.map((game) => (
        <GameCard key={game.code} game={game} />
      ))}
    </div>
  );
}