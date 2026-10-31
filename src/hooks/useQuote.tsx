import { createContext, useContext } from 'react';
import type { ServiceId } from '../content';

interface QuoteContextValue {
  openQuote: (service?: ServiceId) => void;
}

export const QuoteContext = createContext<QuoteContextValue>({ openQuote: () => undefined });
export const useQuote = () => useContext(QuoteContext);
