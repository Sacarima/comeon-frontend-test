import { API_BASE_URL } from './config';

import type {
  Category,
  Game,
  LoginRequest,
  LoginResponse,
} from './types';

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw {
      message: 'Something went wrong. Please try again.',
      status: response.status,
    };
  }

  return response.json() as Promise<T>;
}

export function login(credentials: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logout(username: string): Promise<{ status: 'success' }> {
  return request<{ status: 'success' }>('/logout', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export function getGames(): Promise<Game[]> {
  return request<Game[]>('/games');
}

export function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}