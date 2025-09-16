import React, { createContext, useContext, useState } from 'react';
import { User, mockCurrentUser, mockPartnerUser } from '@/types/user';

interface UserContextType {
  user: User;
  switchUserRole: (role: 'main-admin' | 'partner-admin') => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockCurrentUser);

  const switchUserRole = (role: 'main-admin' | 'partner-admin') => {
    if (role === 'main-admin') {
      setUser(mockCurrentUser);
    } else {
      setUser(mockPartnerUser);
    }
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
  };

  return (
    <UserContext.Provider value={{ user, switchUserRole, updatePreferences }}>
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