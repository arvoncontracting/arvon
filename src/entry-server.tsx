import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';

/** React renders the page once, at build time. No React code reaches the browser. */
export const render = () => renderToStaticMarkup(<App />);
