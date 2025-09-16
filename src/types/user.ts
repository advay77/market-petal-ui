export type UserRole = 'main-admin' | 'partner-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  partnerId?: string; // Only for partner-admin users
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    layout: 'modern' | 'compact' | 'enterprise';
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
}

// Mock current user context
export const mockCurrentUser: User = {
  id: 'user1',
  name: 'Admin User',
  email: 'admin@lovablemarket.com',
  role: 'main-admin',
  preferences: {
    theme: 'light',
    layout: 'modern',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
  },
};

export const mockPartnerUser: User = {
  id: 'user2',
  name: 'Partner Admin',
  email: 'admin@technogear.com',
  role: 'partner-admin',
  partnerId: 'p1',
  preferences: {
    theme: 'light',
    layout: 'modern',
    notifications: {
      email: true,
      push: true,
      marketing: true,
    },
  },
};