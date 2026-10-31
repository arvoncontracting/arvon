import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

hydrateRoot(root, app);
