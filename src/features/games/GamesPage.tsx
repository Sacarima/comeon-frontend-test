import { useEffect, useMemo, useRef, useState } from 'react';
import { GamesPageSkeleton } from './GamesPageSkeleton';

import { getCategories, getGames } from '../../api';
import type { Category, Game } from '../../types';
import { CategoryList } from './CategoryList';
import { filterGames } from './filterGames';
import { GamesGrid } from './GamesGrid';

const PAGE_SIZE = 4;

type GamesPageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; games: Game[]; categories: Category[] };

export function GamesPage() {
  const [state, setState] = useState<GamesPageState>({ status: 'loading' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [visibleGamesCount, setVisibleGamesCount] = useState(PAGE_SIZE);

  const searchFieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGamesData() {
      try {
        const [games, categories] = await Promise.all([
          getGames(),
          getCategories(),
        ]);

        if (isMounted) {
          setState({ status: 'success', games, categories });
        }
      } catch {
        if (isMounted) {
          setState({
            status: 'error',
            message: 'Could not load games. Please try again.',
          });
        }
      }
    }

    void loadGamesData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!searchFieldRef.current) {
        return;
      }

      const clickedOutside = !searchFieldRef.current.contains(
        event.target as Node,
      );

      if (!clickedOutside) {
        return;
      }

      setIsSearchFocused((currentValue) => {
        if (!currentValue) {
          return currentValue;
        }

        return false;
      });
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const filteredGames = useMemo(() => {
    if (state.status !== 'success') {
      return [];
    }

    return filterGames({
      games: state.games,
      searchTerm,
      selectedCategoryId,
    });
  }, [state, searchTerm, selectedCategoryId]);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleGamesCount);
  }, [filteredGames, visibleGamesCount]);

  const hasMoreGames = visibleGamesCount < filteredGames.length;

  const searchSuggestions = useMemo(() => {
    if (searchTerm.trim().length === 0) {
      return [];
    }

    return filteredGames.slice(0, 5);
  }, [filteredGames, searchTerm]);

  const shouldShowSuggestions =
    isSearchFocused &&
    searchTerm.trim().length > 0 &&
    searchSuggestions.length > 0;

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setIsSearchFocused(true);
    setVisibleGamesCount(PAGE_SIZE);
  }

  function handleClearSearch() {
    setSearchTerm('');
    setIsSearchFocused(false);
    setVisibleGamesCount(PAGE_SIZE);
  }

  function handleSelectCategory(categoryId: number | null) {
    setSelectedCategoryId(categoryId);
    setVisibleGamesCount(PAGE_SIZE);
  }

  function handleSelectSuggestion(gameName: string) {
    setSearchTerm(gameName);
    setIsSearchFocused(false);
    setVisibleGamesCount(PAGE_SIZE);
  }

  function handleLoadMoreGames() {
    setVisibleGamesCount((currentCount) => currentCount + PAGE_SIZE);
  }

  if (state.status === 'loading') {
    return <GamesPageSkeleton />;
  }

  if (state.status === 'error') {
    return (
      <section className="games-section" aria-label="Games">
        <p className="state-message state-message-error" role="alert">
          {state.message}
        </p>
      </section>
    );
  }

  return (
    <section className="games-section" aria-label="Games">
      <div className="games-toolbar">
        <div className="search-field" ref={searchFieldRef}>
          <label className="sr-only" htmlFor="game-search">
            Search games
          </label>

         
          <input
            id="game-search"
            type="text"
            placeholder="Search game"
            value={searchTerm}
            autoComplete="off"
            onFocus={() => setIsSearchFocused(true)}
            onChange={(event) => {
              handleSearchChange(event.target.value);
            }}
          />
           
            <h3 className="games-heading">Games</h3>

          {searchTerm.trim().length > 0 && (
            <button
              type="button"
              className="search-clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          {shouldShowSuggestions && (
            <div
              className="search-suggestions"
              role="listbox"
              aria-label="Game suggestions"
            >
              {searchSuggestions.map((game) => (
                <button
                  key={game.code}
                  type="button"
                  className="search-suggestion"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelectSuggestion(game.name);
                  }}
                >
                  {game.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="games-content">
        <div className="games-main">
          {filteredGames.length === 0 ? (
            <p className="state-message">
              No games match your search or selected category.
            </p>
          ) : (
            <>
              <GamesGrid games={visibleGames} />

              {hasMoreGames && (
                <button
                  type="button"
                  className="button button-primary games-load-more"
                  onClick={handleLoadMoreGames}
                >
                  Load more games
                </button>
              )}
            </>
          )}
        </div>

        <CategoryList
          categories={state.categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </div>
    </section>
  );
}