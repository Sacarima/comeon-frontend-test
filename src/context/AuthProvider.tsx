import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { login as loginRequest, logout as logoutRequest } from '../api';
import type { LoginFormValues } from '../schemas/auth';
import type { Player } from '../types';
import { AuthContext, type AuthContextValue } from './AuthContext';

type AuthSession = {
  username: string;
  player: Player;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AUTH_SESSION_KEY = 'comeon-auth-session';

function getStoredSession(): AuthSession | null {
  const storedSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession);
  const [loginError, setLoginError] = useState<string>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = useCallback(async (values: LoginFormValues) => {
    setLoginError(undefined);
    setIsLoggingIn(true);

    try {
      const response = await loginRequest(values);

      if (response.status === 'success') {
        const nextSession = {
          username: values.username,
          player: response.player,
        };

        setSession(nextSession);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
        return;
      }

      setLoginError('Invalid username or password');
    } catch {
      setLoginError('Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
  if (!session) {
    return;
  }

  setIsLoggingOut(true);

  try {
    await logoutRequest(session.username);
  } catch {
    // Local logout should still complete even if the mock API fails.
  } finally {
    setSession(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
    setLoginError(undefined);
    setIsLoggingOut(false);
  }
}, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      player: session?.player ?? null,
      loginError,
      isLoggingIn,
      isLoggingOut,
      login,
      logout,
    }),
    [session, loginError, isLoggingIn, isLoggingOut, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}