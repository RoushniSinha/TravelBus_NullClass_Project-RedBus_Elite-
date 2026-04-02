import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import i18n from './i18n/config';
import { ThemeProvider } from './context/ThemeContext';
import { seedData } from './seedData';

const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const isApiCall = url.startsWith('/api') || url.includes('/api/');

  if (!isApiCall) {
    return originalFetch(input, init);
  }

  const lang = localStorage.getItem('rb_lang') || i18n.language || 'en';
  const headers = new Headers(init.headers || {});
  headers.set('Accept-Language', lang);
  headers.set('X-Language', lang);

  return originalFetch(input, {
    ...init,
    headers,
  });
};

// Seed sample data if not already seeded
if (!localStorage.getItem('data_seeded')) {
  seedData().then(() => {
    localStorage.setItem('data_seeded', 'true');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
