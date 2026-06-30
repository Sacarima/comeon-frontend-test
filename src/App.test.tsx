import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthProvider } from './context/AuthProvider';
import { App } from './App';

describe('App', () => {
  it('renders the landing page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('main')).toBeVisible();
  });
});