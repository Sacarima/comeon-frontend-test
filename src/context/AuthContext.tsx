import { createContext } from 'react';

import type { LoginFormValues } from '../schemas/auth';
import type { Player } from '../types';

export type AuthContextValue = {
  player: Player | null;
  loginError?: string;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);