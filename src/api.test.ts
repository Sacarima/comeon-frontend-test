import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCategories, getGames, login, logout } from './api';
import { API_BASE_URL } from './config';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

function createJsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

describe('api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('sends login credentials to the login endpoint', async () => {
    const responseBody = {
      status: 'success',
      player: {
        name: 'Rebecka Awesome',
        avatar: 'images/avatar/rebecka.jpg',
        event: 'Last seen gambling on Starburst.',
      },
    };

    fetchMock.mockResolvedValueOnce(createJsonResponse(responseBody));

    const result = await login({
      username: 'rebecka',
      password: 'secret',
    });

    expect(result).toEqual(responseBody);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/login`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'rebecka',
          password: 'secret',
        }),
      }),
    );
  });

  it('sends logout request with the username', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        status: 'success',
      }),
    );

    const result = await logout('rebecka');

    expect(result).toEqual({
      status: 'success',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/logout`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'rebecka',
        }),
      }),
    );
  });

  it('loads games from the games endpoint', async () => {
    const games = [
      {
        name: 'Festing Fox',
        description: 'Fox game',
        code: 'feastingfox',
        icon: 'images/game-icon/feasting_fox.png',
        categoryIds: [0, 2],
      },
    ];

    fetchMock.mockResolvedValueOnce(createJsonResponse(games));

    await expect(getGames()).resolves.toEqual(games);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/games`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('loads categories from the categories endpoint', async () => {
    const categories = [
      {
        id: 0,
        name: 'ALL',
      },
    ];

    fetchMock.mockResolvedValueOnce(createJsonResponse(categories));

    await expect(getCategories()).resolves.toEqual(categories);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/categories`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('throws a normalized error when the API response fails', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        {
          status: 'fail',
          error: 'player does not exist or wrong password',
        },
        {
          status: 400,
        },
      ),
    );

    await expect(
      login({
        username: 'rebecka',
        password: 'wrong',
      }),
    ).rejects.toEqual({
      message: 'Something went wrong. Please try again.',
      status: 400,
    });
  });
});