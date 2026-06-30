import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { Header } from '../../components/Header';
import { getGames } from '../../api';
import type { Game } from '../../types';

type ComeonGlobal = typeof globalThis & {
  comeon?: {
    game?: {
      launch?: (gameCode: string) => void;
    };
  };
};

type GamePlayState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; message: string }
  | { status: 'success'; game: Game };

export function GamePlayPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [state, setState] = useState<GamePlayState>({ status: 'loading' });

  const gameCodeToLaunch = state.status === 'success' ? state.game.code : null;

  useEffect(() => {
    let isMounted = true;

    async function loadGame() {
      if (!gameCode) {
        setState({ status: 'not-found' });
        return;
      }

      try {
        const games = await getGames();
        const selectedGame = games.find((game) => game.code === gameCode);

        if (!isMounted) {
          return;
        }

        if (!selectedGame) {
          setState({ status: 'not-found' });
          return;
        }

        setState({ status: 'success', game: selectedGame });
      } catch {
        if (isMounted) {
          setState({
            status: 'error',
            message: 'Could not load the selected game. Please try again.',
          });
        }
      }
    }

    void loadGame();

    return () => {
      isMounted = false;
    };
  }, [gameCode]);

  useEffect(() => {
    if (!gameCodeToLaunch) {
      return;
    }

    const launchContainer = document.getElementById('game-launch');

    if (!launchContainer) {
      return;
    }

    launchContainer.innerHTML = '';

    const comeonGlobal = globalThis as ComeonGlobal;
    const launchGame = comeonGlobal.comeon?.game?.launch;

    if (!launchGame) {
      launchContainer.innerHTML = `
        <div class="game-launch-fallback">
          <h2>Game launcher unavailable</h2>
          <p>The selected game could not be started right now. Please try again later or choose another game.</p>
        </div>
      `;

      return;
    }

    try {
      launchGame(gameCodeToLaunch);
    } catch {
      launchContainer.innerHTML = `
        <div class="game-launch-fallback">
          <h2>Game could not be loaded</h2>
          <p>Something went wrong while starting this game. Please try again later or choose another game.</p>
        </div>
      `;
    }

    return () => {
      launchContainer.innerHTML = '';
    };
  }, [gameCodeToLaunch]);

  if (state.status === 'not-found') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header showActions={false} />

      <main className="game-play-page">
        <div className="game-play-header">
          <Link to="/lobby" className="button button-link">
            Back to games
          </Link>

          {state.status === 'success' && <h1>{state.game.name}</h1>}
        </div>

        {state.status === 'loading' && (
          <p className="state-message" role="status">
            Loading game...
          </p>
        )}

        {state.status === 'error' && (
          <p className="state-message state-message-error" role="alert">
            {state.message}
          </p>
        )}

        {state.status === 'success' && (
          <section className="game-shell" aria-label={`${state.game.name} game`}>
            <div className="game-shell-topbar">
              <div className="game-shell-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <p className="game-shell-title">{state.game.name}</p>

              <div aria-hidden="true" />
            </div>

            <div className="game-launch-panel">
              <div id="game-launch" />
            </div>
          </section>
        )}
      </main>
    </>
  );
}