import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const REVEAL = { y: 26, duration: 0.7, ease: 'power3.out' } as const;

/** Fades in content below the fold. Anything already passed stays visible. */
function reveals() {
  const below = gsap.utils
    .toArray<HTMLElement>('[data-reveal]')
    .filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  if (!below.length) return;
  gsap.set(below, { y: REVEAL.y, opacity: 0 });
  ScrollTrigger.batch(below, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { ...REVEAL, y: 0, opacity: 1, stagger: 0.06, overwrite: true }),
  });
}

/** Line and active stage follow the scroll; every stage stays readable either way. */
function asphaltTimeline() {
  const list = document.querySelector<HTMLElement>('.timeline');
  const fill = document.querySelector<HTMLElement>('.timeline__fill');
  const stages = gsap.utils.toArray<HTMLElement>('.timeline__stage');
  if (!list || !fill || !stages.length) return;

  let current = -1;
  const setActive = (index: number) => {
    if (index === current) return;
    current = index;
    stages.forEach((stage, i) => {
      stage.classList.toggle('is-active', i === index);
      stage.classList.toggle('is-done', i < index);
      if (i === index) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
  };

  list.classList.add('is-live');
  ScrollTrigger.create({
    trigger: list,
    start: 'top 62%',
    end: 'bottom 62%',
    onUpdate: (self) => {
      fill.style.transform = `scaleY(${self.progress})`;
      const reached = self.progress * list.offsetHeight;
      let index = 0;
      stages.forEach((stage, i) => {
        if (stage.offsetTop <= reached) index = i;
      });
      setActive(index);
    },
  });
  setActive(0);
  ScrollTrigger.addEventListener('refreshInit', () => setActive(current));
}

/** The sticky stage shows the photograph of whichever service is being read. */
function waterproofingStage() {
  const plates = gsap.utils.toArray<HTMLElement>('.stage__plate');
  const ticks = gsap.utils.toArray<HTMLElement>('.stage__tick');
  if (!plates.length) return;
  const activate = (index: number) => {
    plates.forEach((plate, i) => plate.classList.toggle('is-active', i <= index));
    ticks.forEach((tick, i) => tick.classList.toggle('is-active', i === index));
  };
  activate(0);
  gsap.utils.toArray<HTMLElement>('.systems__list .service').forEach((panel, index) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => {
        if (self.isActive) activate(index);
      },
    });
  });
}

/** Heavier scrubbed effects, desktop only. */
function desktopScenes() {
  const hero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__media picture', { yPercent: 9, ease: 'none', scrollTrigger: hero });
  gsap.to('.hero__content', { yPercent: -10, ease: 'none', scrollTrigger: hero });

  gsap.fromTo(
    '.road__photo picture',
    { scale: 1.14 },
    { scale: 1, ease: 'none', scrollTrigger: { trigger: '.road', start: 'top bottom', end: 'bottom top', scrub: 0.5 } },
  );

  gsap.utils.toArray<HTMLElement>('[data-edge]').forEach((edge) => {
    gsap.from(edge, {
      scaleY: 0,
      ease: 'none',
      scrollTrigger: { trigger: edge, start: 'top bottom', end: 'bottom 55%', scrub: 0.4 },
    });
  });

  // Surfaces arrive on a slope and finish level, echoing screed and trowel work.
  gsap.utils.toArray<HTMLElement>('.service-row').forEach((row) => {
    const scrollTrigger = { trigger: row, start: 'top 90%', end: 'top 35%', scrub: 0.5 };
    gsap.fromTo(
      row.querySelector('.service-row__figure'),
      { clipPath: 'polygon(0 16%, 100% 0, 100% 100%, 0 100%)' },
      { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', ease: 'none', scrollTrigger },
    );
    gsap.fromTo(row.querySelector('.service-row__level'), { rotate: -4 }, { rotate: 0, ease: 'none', scrollTrigger });
  });

  gsap.fromTo(
    '.certificate__sheet',
    { rotate: -5, y: 50 },
    { rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.certificate', start: 'top 95%', end: 'top 45%', scrub: 0.5 } },
  );

  waterproofingStage();
}

export async function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.setAttribute('data-motion', '');

  reveals();
  asphaltTimeline();

  const media = gsap.matchMedia();
  media.add('(min-width: 1024px)', desktopScenes);

  await document.fonts?.ready;
  ScrollTrigger.refresh();
}
