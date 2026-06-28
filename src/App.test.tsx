import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the milestone setup screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /project setup and tooling/i })).toBeVisible();
  });
});