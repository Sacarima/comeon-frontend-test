import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Header } from '../Header';

type AuthLayoutProps = {
  title: string;
  switchLabel: string;
  switchTo: string;
  children: ReactNode;
};

export function AuthLayout({
  title,
  switchLabel,
  switchTo,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <Header showActions={false} />

      <main className="auth-main">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-panel-header">
            <button type="button" className="button auth-close" aria-label="Close">
              ×
            </button>

            <h1 id="auth-title" className="auth-title">
              {title}
            </h1>

            <Link className="auth-switch" to={switchTo}>
              {switchLabel}
            </Link>
          </div>

          <div className="auth-content">{children}</div>
        </section>
      </main>
    </div>
  );
}