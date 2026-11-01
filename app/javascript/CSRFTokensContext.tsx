import { createContext } from 'react';

export type CSRFTokensContextValue = {
  signInCSRFToken: string;
  signOutCSRFToken: string;
};

export const CSRFTokensContext = createContext<CSRFTokensContextValue>({
  signInCSRFToken: '',
  signOutCSRFToken: '',
});
