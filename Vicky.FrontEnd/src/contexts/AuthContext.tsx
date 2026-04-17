import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthActionType } from './types/auth-types';
import type { AuthState, AuthAction, AuthContextType } from './types/auth-types';
import { AuthorizationClient } from '../services/AuthorizationClient';
import type { LoginRequest } from '../services/requests/login-request';
import type { RegisterRequest } from '../services/requests/register-request';
import type { ProfileResponseData } from '../services/responses/profile-response';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AuthActionType.SET_USER:
      return { ...state, user: action.payload, error: null };
    case AuthActionType.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case AuthActionType.LOGIN_SUCCESS:
      return { ...state, user: action.payload, isLoading: false, error: null };
    case AuthActionType.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case AuthActionType.LOGOUT:
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const apiClient = new AuthorizationClient(import.meta.env.VITE_API_URL || 'http://localhost:8080');

  useEffect(() => {
    const token = localStorage.getItem('vickyToken');

    if (!token) {
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      return;
    }

    apiClient.setToken(token);

    const fetchProfile = async () => {
      try {
        const profile = await apiClient.getProfile() as ProfileResponseData;
        dispatch({ type: AuthActionType.SET_USER, payload: profile });
      } catch (error) {
        localStorage.removeItem('vickyToken');
        dispatch({ type: AuthActionType.SET_ERROR, payload: 'Session expired. Please log in again.' });
      } finally {
        dispatch({ type: AuthActionType.SET_LOADING, payload: false })
      }
    };

    fetchProfile();
  }, []);

  const isAuthenticated = useCallback(() => {
    return state.user != null;
  }, [state]);

  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });
    dispatch({ type: AuthActionType.SET_ERROR, payload: null });

    try {
      const request: RegisterRequest = { username, password };
      await apiClient.register(request);

      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: AuthActionType.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });
    dispatch({ type: AuthActionType.SET_ERROR, payload: null });

    try {
      const request: LoginRequest = { username, password };
      const response = await apiClient.login(request);
      const token = response.data.token.payload;
      apiClient.setToken(token);
      localStorage.setItem('vickyToken', token);
      dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: { id: username, username } });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: AuthActionType.LOGIN_FAILURE, payload: errorMessage });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('vickyToken');
    apiClient.setToken(''); // Clear token from API client
    dispatch({ type: AuthActionType.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
