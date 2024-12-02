import { User } from "./user";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userPermissions: string[];
  permissionsLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
