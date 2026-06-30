import { Link } from 'react-router-dom';

import { Header } from '../components/Header';
import { BackgroundRippleEffect } from '../features/landing/BackgroundRippleEffect';

export function LandingPage() {
  return (
    <>
      <Header variant="transparent" />

      <main className="landing-page">
        <BackgroundRippleEffect />

        <section className="landing-hero" aria-labelledby="landing-title">
          <p className="landing-eyebrow">ComeOn Casino</p>

          <h1 id="landing-title">Welcome to ComeOn!</h1>

          <p className="landing-description">
            Start playing your favourite games in seconds. Log in, explore the
            lobby, and jump straight into the action.
          </p>

          <Link to="/login" className="button button-primary landing-cta">
            Get started
          </Link>
        </section>
      </main>
    </>
  );
}