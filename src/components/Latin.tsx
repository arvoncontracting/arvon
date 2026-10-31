import type { ReactNode } from 'react';

/** Isolates Latin runs so they keep correct direction and language inside Arabic text. */
export function Latin({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span lang="en" dir="ltr" className={className ? `latin ${className}` : 'latin'}>
      {children}
    </span>
  );
}
