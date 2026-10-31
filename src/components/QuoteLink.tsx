import type { ReactNode } from 'react';
import { content, type ServiceId } from '../content';
import { useQuote } from '../hooks/useQuote';
import { whatsappUrl } from '../utils/links';

interface QuoteLinkProps {
  service?: ServiceId;
  className?: string;
  children: ReactNode;
}

/** Opens the quote dialog. Without JavaScript it is a plain prefilled WhatsApp link. */
export function QuoteLink({ service, className, children }: QuoteLinkProps) {
  const { openQuote } = useQuote();
  return (
    <a
      className={className}
      href={whatsappUrl(content.quote.fallbackMessage)}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault();
        openQuote(service);
      }}
    >
      {children}
    </a>
  );
}
