/** Solid bar after scrolling, reading progress line, and the mobile menu. */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  const progress = document.querySelector<HTMLElement>('.site-header__progress');
  const menu = document.querySelector<HTMLDialogElement>('dialog.mobile-menu');
  const toggle = document.querySelector<HTMLButtonElement>('.site-header__toggle');
  if (!header || !progress || !menu || !toggle) return;

  let queued = false;
  const update = () => {
    queued = false;
    const { scrollHeight, clientHeight } = document.documentElement;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    progress.style.transform = `scaleX(${Math.min(1, y / Math.max(1, scrollHeight - clientHeight))})`;
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (open) menu.showModal();
    else if (menu.open) menu.close();
  };
  toggle.addEventListener('click', () => setOpen(true));
  menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
  menu.addEventListener('click', (event) => {
    const target = event.target as Element;
    if (target.closest('a, [data-close]')) setOpen(false);
  });
}
