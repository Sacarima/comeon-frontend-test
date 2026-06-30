import { Header } from '../components/Header';
import { GamesPage } from '../features/games/GamesPage';
import { FiPower } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export function LobbyPage() {
  const auth = useAuth();

  return (
    <>
      <Header showActions={false} />

      <main className="lobby-page">
        <section className="player-summary" aria-label="Player profile">
          {auth.player && (
            <>
              <img
                src={`/${auth.player.avatar}`}
                alt=""
                className="player-avatar"
              />

              <div>
                <p className="player-label">Logged in as</p>
                <h1>{auth.player.name}</h1>
                <p>{auth.player.event}</p>
              </div>
            </>
          )}

          <button
            type="button"
            className="button button-primary"
            onClick={auth.logout}
            disabled={auth.isLoggingOut}
            aria-label="Log out"
            title="Log out"
          >
            <FiPower aria-hidden="true" />
          </button>
        </section>

        <GamesPage />
      </main>
    </>
  );
}