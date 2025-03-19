import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { config } from '../config';
import { imageUrl } from '../utils/imageUrl';
import { api, apiPath } from './api';
import { GetUserResponse } from './api/types';

type AuthStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

interface UserState {
  firstName: string;
  lastName: string;
  profileImgUrl: string;
}

interface AuthState {
  user: UserState;
  token: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: {
    firstName: '',
    lastName: '',
    profileImgUrl: '',
  },
  token: null,
  isAuthenticated: false,
  status: 'idle',
};

type AuthProviderValue = AuthState & {
  login: (user: AuthState['user'], token: string) => void;
  logout: () => void;
  updateUser: (user: AuthState['user']) => void;
  setAuthenticationStatus: (status: AuthStatus) => void;
};

const defaultAuthProviderValue = {
  ...initialState,
  login: (user = {}, token = '') => {},
  logout: () => {},
  updateUser: () => {},
  setAuthenticationStatus: () => {},
};
const AuthContext = createContext<AuthProviderValue>(defaultAuthProviderValue);

const authReducer = (
  state: AuthState,
  action: { type: 'login' | 'logout' | 'updateUser' | 'status'; payload?: any }
): AuthState => {
  switch (action.type) {
    case 'login': {
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        status: 'succeeded',
      };
    }
    case 'logout': {
      return {
        ...initialState,
        status: 'idle',
      };
    }
    case 'updateUser': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'status': {
      return {
        ...state,
        status: action.payload.status,
      };
    }
  }
};

const AuthProvider = ({ children }: React.ProviderProps<AuthProviderValue>) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user: AuthState['user'], token: string) => {
    dispatch({
      type: 'login',
      payload: {
        user,
        token,
      },
    });
  }, []);

  const token = Cookies.get(config.cookie.accessToken);
  if (token && !state.user.firstName) {
    api.get<GetUserResponse>(apiPath.getMyUser).then((response) => {
      login(
        {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          profileImgUrl: response.data.imageUuid
            ? imageUrl(response.data.imageUuid)
            : '/assets/images/user-icon.svg',
        },
        token
      );
    });
  }

  const logout = useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, []);

  const updateUser = useCallback((user: AuthState['user']) => {
    dispatch({
      type: 'updateUser',
      payload: {
        user,
      },
    });
  }, []);

  const setAuthenticationStatus = useCallback((status: AuthStatus) => {
    dispatch({
      type: 'status',
      payload: {
        status,
      },
    });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, logout, updateUser, setAuthenticationStatus }),
    [state, setAuthenticationStatus, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { AuthProvider, useAuth, defaultAuthProviderValue };
