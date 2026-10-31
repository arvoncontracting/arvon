import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  id?: string;
  className?: string;
}

/** Section tab plus heading. The orange tab uses the symbol's slope for its cut edge. */
export function SectionHeading({ eyebrow, title, body, id, className = '' }: SectionHeadingProps) {
  return (
    <header className={`section-heading ${className}`}>
      <p className="section-tab" data-reveal>{eyebrow}</p>
      <h2 id={id} data-reveal>{title}</h2>
      {body && <p className="section-heading__body" data-reveal>{body}</p>}
    </header>
  );
}
