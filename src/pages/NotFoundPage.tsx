import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
        </p>

        <Link to="/" className="button button-primary not-found-link">
          Back to home
        </Link>
      </section>
    </main>
  );
}