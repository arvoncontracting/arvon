/**
 * Hides the floating button while a section with its own WhatsApp link is on screen.
 * On phones it also stays away during reading and returns when the visitor scrolls up.
 */
export function initFloatingWhatsApp() {
  const button = document.querySelector<HTMLAnchorElement>('.floating-whatsapp');
  const sections = [document.getElementById('top'), document.getElementById('contact')].filter(Boolean) as HTMLElement[];
  if (!button) return;

  const visible = new Set<Element>();
  const narrow = matchMedia('(max-width: 767.98px)');
  let scrollingUp = false;
  let lastY = window.scrollY;

  const render = () => {
    const hidden = visible.size > 0 || (narrow.matches && !scrollingUp);
    button.classList.toggle('is-hidden', hidden);
    button.tabIndex = hidden ? -1 : 0;
  };

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 12) return;
      scrollingUp = y < lastY;
      lastY = y;
      render();
    },
    { passive: true },
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      render();
    },
    { threshold: 0.12 },
  );
  sections.forEach((section) => observer.observe(section));
}
