const SKELETON_CARD_COUNT = 4;

export function GamesPageSkeleton() {
  return (
    <section className="games-section" aria-label="Games">
      <div className="games-toolbar">
        <div className="search-field">
          <div className="skeleton skeleton-search" />
        </div>
      </div>

      <div className="games-content">
        <div className="games-main">
          <div className="games-grid" aria-hidden="true">
            {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <article className="game-card game-card-skeleton" key={index}>
                <div className="skeleton skeleton-game-image" />

                <div className="skeleton-game-content">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-line-short" />
                  <div className="skeleton skeleton-button" />
                </div>
              </article>
            ))}
          </div>

          <p className="sr-only" role="status">
            Loading games...
          </p>
        </div>

        <aside
          className="category-list category-list-skeleton"
          aria-hidden="true"
        >
          <div className="skeleton skeleton-category-title" />
          <div className="skeleton skeleton-category-item" />
          <div className="skeleton skeleton-category-item" />
          <div className="skeleton skeleton-category-item" />
          <div className="skeleton skeleton-category-item" />
        </aside>
      </div>
    </section>
  );
}