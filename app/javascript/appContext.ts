import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createContext } from 'react-router';
import type { AppConfig } from './appConfig';

export type AppContextValue = {
  config: AppConfig;
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

/** Set by the root route's middleware, so every loader and action can use the same Apollo client */
export const appContext = createContext<AppContextValue>();
