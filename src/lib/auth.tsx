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
type UserRole = 'user' | 'admin';

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  profileImgUrl: string;
  role: UserRole;
}

interface AuthState {
  user: UserState;
  token: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    profileImgUrl: '',
    role: 'user',
  },
  token: null,
  isAuthenticated: false,
  status: 'idle',
};

type AuthProviderValue = AuthState & {
  login: (user: UserState, token: string) => void;
  logout: () => void;
  updateUser: (user: UserState) => void;
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

interface ActionLogin {
  type: 'login';
  payload: {
    user: UserState;
    token: string;
  };
}

interface ActionLogout {
  type: 'logout';
}

interface ActionUpdateUser {
  type: 'updateUser';
  payload: {
    user: UserState;
  };
}

interface ActionStatus {
  type: 'status';
  payload: {
    status: AuthStatus;
  };
}

type Action = ActionLogin | ActionLogout | ActionUpdateUser | ActionStatus;

const authReducer = (state: AuthState, action: Action): AuthState => {
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

  const login = useCallback((user: UserState, token: string) => {
    dispatch({
      type: 'login',
      payload: {
        user,
        token,
      },
    });
  }, []);

  const token = Cookies.get(config.cookie.accessToken);
  if (token) {
    state.token = token;
    state.isAuthenticated = true;
    state.status = 'succeeded';

    if (!state.user.firstName) {
      api
        .get<GetUserResponse>(apiPath.getMyUser)
        .then((response) => {
          updateUser({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            profileImgUrl: response.data.imageUuid
              ? imageUrl(response.data.imageUuid)
              : '/assets/images/user-icon.svg',
            role: response.data.role.name.toLowerCase() as UserRole,
          });
        })
        .catch(() => {
          Cookies.remove(config.cookie.accessToken);
          Cookies.remove(config.cookie.refreshToken);
        });
    }
  }

  const logout = useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, []);

  const updateUser = useCallback((user: UserState) => {
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
