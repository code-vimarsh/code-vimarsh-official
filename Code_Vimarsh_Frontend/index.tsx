import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalProvider } from './context/GlobalContext';

// Capture recovery token immediately before Supabase clears it from the URL hash/search
if (typeof window !== 'undefined') {
  const hasRecovery = window.location.hash.includes('type=recovery') || 
                      window.location.hash.includes('recovery_token=') ||
                      window.location.search.includes('type=recovery') ||
                      window.location.search.includes('recovery_token=');
  if (hasRecovery) {
    sessionStorage.setItem('cv_is_recovering', 'true');
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);