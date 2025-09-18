import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Store } from "lucide-react";

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
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import { cn } from "@/lib/utils";


export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useUser();
  const { mainItems, secondaryItems } = useRoleBasedNavigation();
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
              {mainItems.map((item) => (
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
              {secondaryItems.map((item) => (
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

      </SidebarContent>
    </Sidebar>
  );
}