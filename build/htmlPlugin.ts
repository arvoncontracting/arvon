import type { Plugin } from 'vite';
import { logoGeometry } from '../src/data/logoGeometry';
import { logoArtwork } from './logoArtwork';

const { symbol, standalone, wordEn } = logoArtwork;

const path = (id: string, role: 'accent' | 'body', d: string) =>
  `<path id="${id}" fill-rule="evenodd" style="fill:var(--logo-${role})" d="${d}"/>`;

/** One copy of the logo paths for the whole page; every logo is a set of <use> references. */
const sprite = `<svg aria-hidden="true" width="0" height="0" style="position:absolute"><defs>${[
  path('lg-roof', 'accent', symbol.orange),
  path('lg-pier', 'body', symbol.dark),
  path('lg-roof-s', 'accent', standalone.orange),
  path('lg-pier-s', 'body', standalone.dark),
  path('lg-word', 'body', wordEn.dark),
  path('lg-word-mark', 'accent', wordEn.orange),
].join('')}</defs></svg>`;

const { master } = logoGeometry;
const introLogo = `<svg class="logo logo--dark-bg" viewBox="${master.viewBox}"><g transform="${master.symbol}"><use class="intro__roof" href="#lg-roof"/><use class="intro__pier" href="#lg-pier"/></g><g class="intro__word" transform="${master.word}"><use href="#lg-word"/><use href="#lg-word-mark"/></g></svg>`;

/** Injects the sprite and intro logo, and serves server-rendered markup in dev. */
export function arvonHtml(): Plugin {
  return {
    name: 'arvon-html',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, context) {
        let page = html.replace('<!--logo-sprite-->', sprite).replace('<!--intro-logo-->', introLogo);
        if (context.server) {
          const entry = await context.server.ssrLoadModule('/src/entry-server.tsx');
          page = page.replace('<!--app-html-->', entry.render());
        }
        return page;
      },
    },
  };
}
