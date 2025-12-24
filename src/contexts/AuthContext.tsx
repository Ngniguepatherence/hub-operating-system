import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ceo' | 'coo' | 'cto' | 'media_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleNames: Record<UserRole, string> = {
  ceo: 'CEO - Strategic Admin',
  coo: 'COO - Operational Admin',
  cto: 'CTO - Technical Admin',
  media_manager: 'Media Content Manager',
  admin: 'Admin / Secretariat',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser({
      id: '1',
      name: roleNames[role],
      email,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
