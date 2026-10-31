import { content } from '../content';
import { whatsappUrl } from '../utils/links';
import { Icon } from './Icon';

/** Parked in the corner. Hidden while a section with its own WhatsApp link is on screen. */
export function FloatingWhatsApp() {
  return (
    <aside aria-label={content.floating.whatsapp}>
      <a
        className="floating-whatsapp is-hidden"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={content.floating.whatsapp}
        tabIndex={-1}
      >
        <Icon name="whatsapp" size={26} />
      </a>
    </aside>
  );
}
