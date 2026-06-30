export type Player = {
  name: string;
  avatar: string;
  event: string;
};

export type Game = {
  name: string;
  description: string;
  code: string;
  icon: string;
  categoryIds: number[];
};

export type Category = {
  id: number;
  name: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginSuccessResponse = {
  status: 'success';
  player: Player;
};

export type LoginFailResponse = {
  status: 'fail';
  message?: string;
};

export type LoginResponse = LoginSuccessResponse | LoginFailResponse;

export type ApiError = {
  message: string;
  status?: number;
};