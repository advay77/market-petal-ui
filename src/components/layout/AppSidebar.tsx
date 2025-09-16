import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronDown,
  ChevronRight,
  Store,
  TrendingUp,
  Wallet,
  UserCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Navigation items for different user roles
const mainAdminItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Partners", url: "/partners", icon: Users },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Settlements", url: "/settlements", icon: CreditCard },
  { title: "Templates", url: "/templates", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const partnerAdminItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "My Products", url: "/products", icon: Package },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Earnings", url: "/earnings", icon: TrendingUp },
  { title: "Settlements", url: "/settlements", icon: Wallet },
  { title: "Storefront", url: "/storefront", icon: Store },
];

const commonItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useUser();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClasses = (path: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
      isActive(path) && [
        "bg-gradient-primary text-primary-foreground shadow-md",
        "hover:bg-gradient-primary hover:text-primary-foreground",
      ]
    );

  const navigationItems = user.role === 'main-admin' ? mainAdminItems : partnerAdminItems;

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-smooth border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Lovable Market</h2>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role.replace('-', ' ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Role Switcher (for demo purposes) */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground mb-2">Demo Mode</div>
            <button
              onClick={() => {
                const newRole = user.role === 'main-admin' ? 'partner-admin' : 'main-admin';
                // This would come from UserContext
                window.location.reload(); // Temporary for demo
              }}
              className="w-full px-3 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors"
            >
              Switch to {user.role === 'main-admin' ? 'Partner' : 'Main'} Admin
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}