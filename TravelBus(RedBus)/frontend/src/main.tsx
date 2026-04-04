import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config';
import { ThemeProvider } from './context/ThemeContext';
import { seedData } from './seedData';

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
