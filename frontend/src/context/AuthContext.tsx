import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role: { id: string; name: string };
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    job_position: string;
    phone?: string;
    private_email?: string;
    bank_account?: string;
    avatar_url?: string;
  } | null;
  isImpersonating?: boolean;
  impersonatedBy?: { id: string; email: string } | string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  impersonateUser: (targetEmployeeId?: string, targetUserId?: string) => Promise<{ success: boolean; message?: string }>;
  endImpersonation: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('pp360_token') || localStorage.getItem('token') || null
  );
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pp360_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('pp360_token', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('pp360_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pp360_token');
    localStorage.removeItem('token');
    localStorage.removeItem('pp360_user');
    localStorage.removeItem('original_admin_token');
    localStorage.removeItem('original_admin_user');
  };

  const impersonateUser = async (targetEmployeeId?: string, targetUserId?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/auth/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_employee_id: targetEmployeeId,
          target_user_id: targetUserId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error?.message || 'Failed to impersonate user' };
      }

      // Save original admin session
      if (token && user) {
        localStorage.setItem('original_admin_token', token);
        localStorage.setItem('original_admin_user', JSON.stringify(user));
      }

      // Update active session with impersonated identity
      const impersonatedUser: User = {
        ...data.data.user,
        isImpersonating: true,
        impersonatedBy: data.data.impersonatedBy,
      };

      login(data.data.token, impersonatedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Impersonation request failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const endImpersonation = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const originalToken = localStorage.getItem('original_admin_token');
      const originalUserStr = localStorage.getItem('original_admin_user');

      // Try backend endpoint
      try {
        const res = await fetch('/api/v1/auth/end-impersonate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          login(data.data.token, data.data.user);
          localStorage.removeItem('original_admin_token');
          localStorage.removeItem('original_admin_user');
          return true;
        }
      } catch {}

      // Fallback restore from localStorage
      if (originalToken && originalUserStr) {
        const origUser = JSON.parse(originalUserStr);
        login(originalToken, origUser);
        localStorage.removeItem('original_admin_token');
        localStorage.removeItem('original_admin_user');
        return true;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, impersonateUser, endImpersonation, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
