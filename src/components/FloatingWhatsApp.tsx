import { content } from '../content';
import { whatsappUrl } from '../utils/links';
import { Icon } from './Icon';

/** Parked in the corner. Hidden while a section with its own WhatsApp link is on screen. */
export function FloatingWhatsApp({ hidden }: { hidden: boolean }) {
  return (
    <aside aria-label={content.floating.whatsapp}>
      <a
        className={`floating-whatsapp${hidden ? ' is-hidden' : ''}`}
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={content.floating.whatsapp}
        tabIndex={hidden ? -1 : undefined}
      >
        <Icon name="whatsapp" size={26} />
      </a>
    </aside>
  );
}
