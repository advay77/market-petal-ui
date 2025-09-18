import { useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Store,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  roles: ('main-admin' | 'partner-admin')[];
}

// Define all navigation items with their allowed roles
const allNavigationItems: NavigationItem[] = [
  // Shared items (both roles)
  { title: "Overview", url: "/", icon: LayoutDashboard, roles: ['main-admin', 'partner-admin'] },
  { title: "Products", url: "/products", icon: Package, roles: ['main-admin', 'partner-admin'] },
  { title: "Orders", url: "/orders", icon: ShoppingCart, roles: ['main-admin', 'partner-admin'] },
  { title: "Settlements", url: "/settlements", icon: CreditCard, roles: ['main-admin', 'partner-admin'] },
  { title: "Analytics", url: "/analytics", icon: BarChart3, roles: ['main-admin', 'partner-admin'] },
  { title: "Earnings", url: "/earnings", icon: TrendingUp, roles: ['main-admin', 'partner-admin'] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ['main-admin', 'partner-admin'] },
  { title: "Notifications", url: "/notifications", icon: Bell, roles: ['main-admin', 'partner-admin'] },
  { title: "Profile", url: "/profile", icon: UserCheck, roles: ['main-admin', 'partner-admin'] },
  
  // Admin-only items
  { title: "Partners", url: "/partners", icon: Users, roles: ['main-admin'] },
  { title: "Templates", url: "/templates", icon: FileText, roles: ['main-admin'] },
  
  // Partner-only items
  { title: "Storefront", url: "/storefront", icon: Store, roles: ['partner-admin'] },
];

export const useRoleBasedNavigation = () => {
  const { user } = useUser();

  const allowedItems = useMemo(() => {
    return allNavigationItems.filter(item => 
      item.roles.includes(user.role)
    );
  }, [user.role]);

  // Group items by category for better organization
  const mainItems = allowedItems.filter(item => 
    ['/', '/products', '/partners', '/orders', '/settlements', '/templates', '/analytics', '/earnings', '/storefront'].includes(item.url)
  );

  const secondaryItems = allowedItems.filter(item => 
    ['/settings', '/notifications', '/profile'].includes(item.url)
  );

  return {
    allAllowedItems: allowedItems,
    mainItems,
    secondaryItems,
    hasAccess: (url: string) => {
      const item = allNavigationItems.find(item => item.url === url);
      return item ? item.roles.includes(user.role) : false;
    }
  };
};
