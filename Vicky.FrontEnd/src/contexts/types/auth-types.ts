export type User = {
  id: string;
  username: string;
}

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const AuthActionType = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
} as const;

export type AuthActionType = typeof AuthActionType[keyof typeof AuthActionType];

export type AuthAction =
  | { type: typeof AuthActionType.SET_LOADING; payload: boolean }
  | { type: typeof AuthActionType.SET_USER; payload: User | null }
  | { type: typeof AuthActionType.SET_ERROR; payload: string | null }
  | { type: typeof AuthActionType.LOGIN_SUCCESS; payload: User }
  | { type: typeof AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: typeof AuthActionType.LOGOUT }

export type AuthContextType = {
  state: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated(): boolean;
}