import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Render the App component wrapped in BrowserRouter for routing context
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Since App just has routes, we expect it to render something without throwing
    expect(document.body).toBeDefined();
  });
});
