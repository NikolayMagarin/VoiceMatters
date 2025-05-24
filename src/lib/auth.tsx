import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import Cookies from 'js-cookie';
import { api } from './api';
import { apiPath } from './api/apiPath';
import { config } from '../config';
import { imageUrl } from '../utils/imageUrl';
import { parseJwt } from '../utils/parseJwt';
import { GetAccessTokenResonse, GetUserResponse } from './api/types';

type UserRole = 'user' | 'admin';

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string;
  role: UserRole;
}

interface AuthState {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const AuthContext = createContext<
  ReturnType<typeof useProvideAuth> | undefined
>(undefined);

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_USER':
      return { ...state, user: action.payload.user };
    case 'SET_TOKEN':
      return { ...state, token: action.payload.token };
    default:
      return state;
  }
};

function useProvideAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshPromiseRef = useRef<Promise<string | undefined> | null>(null);

  const login = useCallback((user: UserState | null, token: string) => {
    saveCookies({ accessToken: token });
    dispatch({ type: 'LOGIN', payload: { user, token } });
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(config.cookie.accessToken);
    Cookies.remove(config.cookie.refreshToken);
    Cookies.remove(config.cookie.accessTokenExpires);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const oldToken = Cookies.get(config.cookie.accessToken);
    const refreshToken = Cookies.get(config.cookie.refreshToken);
    if (!oldToken || !refreshToken) {
      logout();
      return;
    }

    refreshPromiseRef.current = new Promise<string | undefined>(
      async (resolve) => {
        try {
          const response = await api.get<GetAccessTokenResonse>(
            apiPath.accessToken,
            {
              params: { RefreshToken: refreshToken },
              headers: { Authorization: `Bearer ${oldToken}` },
            }
          );
          const newToken = response.data;
          saveCookies({ accessToken: newToken });
          dispatch({ type: 'SET_TOKEN', payload: { token: newToken } });
          resolve(newToken);
        } catch {
          logout();
          resolve(undefined);
        } finally {
          refreshPromiseRef.current = null;
        }
      }
    );

    return refreshPromiseRef.current;
  }, [logout]);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get<GetUserResponse>(apiPath.getMyUser, {
        headers: {
          Authorization: `Bearer ${
            state.token || Cookies.get(config.cookie.accessToken)
          }`,
        },
      });
      const user: UserState = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImgUrl: data.imageUuid
          ? imageUrl(data.imageUuid)
          : '/assets/images/user-icon.svg',
        role: data.role.name.toLowerCase() as UserRole,
      };
      dispatch({ type: 'SET_USER', payload: { user } });
    } catch {
      logout();
    }
  }, [logout, state.token]);

  useEffect(() => {
    const initialize = async () => {
      let token = Cookies.get(config.cookie.accessToken);
      if (token) {
        const exp = parseJwt<{ exp: number }>(token).exp;
        if (Date.now() >= exp * 1000) {
          token = await refreshAccessToken();
          if (token) {
            login(null, token);
          }
        } else {
          login(null, token);
        }
        await fetchUser();
      }
    };
    initialize();
  }, [refreshAccessToken, fetchUser, login]);

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (reqConfig) => {
      let token = state.token || Cookies.get(config.cookie.accessToken);
      const expires = Number(Cookies.get(config.cookie.accessTokenExpires));

      if (
        Date.now() >= expires * 1000 &&
        !reqConfig.url?.includes(apiPath.accessToken)
      ) {
        token = await refreshAccessToken();
      }

      if (token) {
        reqConfig.headers['Authorization'] = `Bearer ${token}`;
      }

      return reqConfig;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [state.token, refreshAccessToken]);

  return useMemo(
    () => ({
      ...state,
      login,
      logout,
      fetchUser,
    }),
    [state, login, logout, fetchUser]
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function saveCookies({
  accessToken,
  refreshToken,
}: {
  accessToken?: string;
  refreshToken?: string;
}) {
  if (accessToken) {
    Cookies.set(config.cookie.accessToken, accessToken, {
      expires: 360,
    });
    Cookies.set(
      config.cookie.accessTokenExpires,
      parseJwt<{ exp: number }>(accessToken).exp.toString(),
      {
        expires: 360,
      }
    );
  }

  if (refreshToken) {
    Cookies.set(config.cookie.refreshToken, refreshToken, {
      expires: 360,
    });
  }
}
