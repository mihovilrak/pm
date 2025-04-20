import React, {
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from 'react';
import { api } from '../api/api';
import { User } from '../types/user';
import {
  AuthContextType,
  AuthProviderProps,
  Permission
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const checkSession = async () => {
      try {
        setPermissionsLoading(true);
        setError(null);
        
        const response = await api.get('/check-session');
        
        if (response.status === 200) {
          setCurrentUser(response.data.user);
          const permissionsResponse = await api.get('/users/permissions');
          setUserPermissions(permissionsResponse.data);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setCurrentUser(null);
        setUserPermissions([]);
        setError('Failed to load user session');
      } finally {
        setPermissionsLoading(false);
      }
    };

    checkSession();
  }, []);

  const hasPermission = (requiredPermission: string): boolean => {
    if (permissionsLoading) return false;
    return userPermissions.some(p => p.permission === requiredPermission);
  };


  const login = async (login: string, password: string): Promise<void> => {
    try {
      setPermissionsLoading(true);
      setError(null);
      
      const response = await api.post('/login', { login, password });
      if (response && response.data && response.data.user) {
        setCurrentUser(response.data.user);
        const permissionsResponse = await api.get('/users/permissions');
        setUserPermissions(permissionsResponse.data);
      } else {
        setCurrentUser(null);
        setUserPermissions([]);
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setCurrentUser(null);
      setUserPermissions([]);
      setError('Login failed. Please check your credentials.');
    } finally {
      setPermissionsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setPermissionsLoading(true);
      await api.post('/logout', {});
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setCurrentUser(null);
      setUserPermissions([]);
      
      setPermissionsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        hasPermission,
        permissionsLoading,
        error,
        userPermissions 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
