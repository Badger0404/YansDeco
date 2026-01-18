import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Client {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  last_login: string | null;
}

interface AuthContextType {
  client: Client | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, phone: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleId: string, name: string, email: string, avatarUrl: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedClient = localStorage.getItem('auth_client');
      
      if (storedToken && storedClient) {
        try {
          setToken(storedToken);
          setClient(JSON.parse(storedClient));
          
          const response = await fetch(`${API_URL}/clients/me`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          const data = await response.json();
          
          if (data.success && data.data.client) {
            setClient(data.data.client);
            localStorage.setItem('auth_client', JSON.stringify(data.data.client));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to restore auth:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/clients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.data.token);
        setClient(data.data.client);
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('auth_client', JSON.stringify(data.data.client));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name: string, phone: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/clients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.data.token);
        setClient(data.data.client);
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('auth_client', JSON.stringify(data.data.client));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const loginWithGoogle = async (googleId: string, name: string, email: string, avatarUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/clients/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleId, name, email, avatarUrl })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.data.token);
        setClient(data.data.client);
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('auth_client', JSON.stringify(data.data.client));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setClient(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_client');
  };

  const updateProfile = async (data: { name: string; phone: string }): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_URL}/clients/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        const updatedClient = { ...client, ...data } as Client;
        setClient(updatedClient);
        localStorage.setItem('auth_client', JSON.stringify(updatedClient));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        client,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
