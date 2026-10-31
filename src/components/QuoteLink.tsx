import type { ReactNode } from 'react';
import { content, type ServiceId } from '../content';
import { whatsappUrl } from '../utils/links';

interface QuoteLinkProps {
  service?: ServiceId;
  className?: string;
  children: ReactNode;
}

/** Opens the quote dialog (src/client/quote.ts). Before scripts run it is a plain WhatsApp link. */
export function QuoteLink({ service, className, children }: QuoteLinkProps) {
  return (
    <a className={className} href={whatsappUrl(content.quote.fallbackMessage)} aria-haspopup="dialog" data-quote={service ?? ''}>
      {children}
    </a>
  );
}
