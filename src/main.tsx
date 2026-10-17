import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inknut-antiqua/400.css';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/archivo/wdth-italic.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
