import { Link } from 'react-router-dom';

import type { Game } from '../../types';

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="game-card">
      <div className="game-card-image">
        <img src={`/${game.icon}`} alt={`${game.name} logo`} />
      </div>

      <div className="game-card-content">
        <h2>{game.name}</h2>
        <p>{game.description}</p>
      </div>

      <div className="game-card-actions">
        <Link
          to={`/games/${game.code}`}
          className="button game-card-play-button"
          aria-label={`Play ${game.name}`}
        >
          Play <span aria-hidden="true">›</span>
        </Link>
      </div>
    </article>
  );
}