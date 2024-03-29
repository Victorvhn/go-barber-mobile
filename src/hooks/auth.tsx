import React, {
  createContext, useCallback, useState, useContext, useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SigInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SigInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() : Promise<void> {
      const [token, user] = await AsyncStorage.multiGet(['@GoBarber:token', '@GoBarber:user']);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });

        api.defaults.headers.authorization = `Bearer ${token[1]}`;
      }

      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const {
      data: { token, user },
    } = await api.post('sessions', { email, password });

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({ token: data.token, user });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider value={{
      user: data.user, signIn, signOut, updateUser, isLoading,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};

export { AuthProvider, useAuth };
