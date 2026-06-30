import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { AuthProvider } from './context/AuthProvider';
import { reportWebVitals } from './reportWebVitals';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

if (import.meta.env.DEV) {
  reportWebVitals((metric) => {
    console.info('[web-vitals]', metric.name, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });
}