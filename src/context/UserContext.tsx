import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockCurrentUser, mockPartnerUser } from '@/types/user';

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockCurrentUser);

  // Persist user data to localStorage when it changes
  useEffect(() => {
    if (user && user.id !== 'user1') { // Don't persist mock data
      localStorage.setItem('user-data', JSON.stringify(user));
    }
  }, [user]);

  // Load persisted user data on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('user-data');
    if (savedUserData) {
      try {
        const parsedUser = JSON.parse(savedUserData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user-data');
      }
    }
  }, []);


  const logout = () => {
    // Reset to mock user and clear persisted data
    setUser(mockCurrentUser);
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-data");
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    // Force dark theme only, ignore theme preference changes
    const filteredPreferences = { ...preferences };
    delete filteredPreferences.theme;
    
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...filteredPreferences, theme: 'dark' }
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}