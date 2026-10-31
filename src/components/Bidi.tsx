import { Fragment } from 'react';
import { Latin } from './Latin';

const LATIN_RUN = /([A-Za-z][A-Za-z0-9&/-]*(?: [A-Za-z][A-Za-z0-9&/-]*)*)/;

/** Wraps Latin runs in Arabic text (Underfloor, Base Course, MC, APP) so direction stays correct. */
export function Bidi({ text }: { text: string }) {
  return (
    <>
      {text.split(LATIN_RUN).map((part, index) =>
        index % 2 ? <Latin key={index}>{part}</Latin> : <Fragment key={index}>{part}</Fragment>,
      )}
    </>
  );
}
