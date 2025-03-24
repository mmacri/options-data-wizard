
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the initial color scheme preference
const getInitialColorMode = () => {
  const persistedColorPreference = window.localStorage.getItem('theme-preference');
  if (persistedColorPreference === 'dark' || persistedColorPreference === 'light') {
    return persistedColorPreference;
  }
  
  // If no persisted preference, check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply the initial class to the document root
document.documentElement.classList.add(getInitialColorMode());

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
