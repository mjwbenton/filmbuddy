import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Film wordmark', () => {
    render(<App />);
    expect(screen.getByText('Film')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
  });
});
