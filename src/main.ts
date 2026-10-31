import './styles/index.css';
import { initFloatingWhatsApp } from './client/floating';
import { initHeader } from './client/header';
import { initQuoteDialog } from './client/quote';

initHeader();
initQuoteDialog();
initFloatingWhatsApp();

const motionAllowed = matchMedia('(prefers-reduced-motion: no-preference)').matches;

/** ScrollTrigger measures by briefly resetting scroll, which would abort an anchor jump in progress. */
function whenScrollSettles(run: () => void) {
  let idle = 0;
  const wait = () => {
    window.clearTimeout(idle);
    idle = window.setTimeout(() => {
      window.removeEventListener('scroll', wait);
      run();
    }, 180);
  };
  window.addEventListener('scroll', wait, { passive: true });
  wait();
}

if (motionAllowed) {
  // A jump that starts just as ScrollTrigger measures gets cancelled, so it is resumed afterwards.
  // That covers links and arriving on a #hash, unless the visitor has since taken over scrolling.
  let jumpTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
  let jumpAt = performance.now();
  document.addEventListener('click', (event) => {
    const hash = (event.target as Element).closest('a[href^="#"]')?.getAttribute('href');
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
    if (target) {
      jumpTarget = target;
      jumpAt = performance.now();
    }
  });
  (['wheel', 'touchmove'] as const).forEach((name) =>
    window.addEventListener(name, () => (jumpTarget = null), { passive: true }),
  );
  const resumeJump = () => {
    if (jumpTarget && performance.now() - jumpAt < 5000) jumpTarget.scrollIntoView();
  };

  // Scroll choreography waits for the first scroll, or for a quiet moment after load.
  const events = ['scroll', 'pointerdown', 'keydown'] as const;
  let timer = 0;
  const load = () => {
    window.clearTimeout(timer);
    events.forEach((name) => window.removeEventListener(name, load));
    void import('./motion').then(({ initMotion }) => whenScrollSettles(() => void initMotion().then(resumeJump)));
  };
  events.forEach((name) => window.addEventListener(name, load, { once: true, passive: true }));
  timer = window.setTimeout(load, 3500);
}
