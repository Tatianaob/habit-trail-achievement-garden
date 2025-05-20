
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Calendar, Award, LayoutDashboard } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/habits', label: 'Habits', icon: Activity },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/achievements', label: 'Achievements', icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && currentPath === '/') return true;
    return currentPath.startsWith(path);
  };

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center py-2 px-3 w-full rounded-md transition-colors',
      isActive
        ? 'text-sidebar-accent-foreground bg-sidebar-accent font-medium'
        : 'text-sidebar-foreground hover:bg-sidebar-accent/40'
    );

  return (
    <Sidebar
      className={cn(
        'border-r',
        collapsed ? 'w-16' : 'w-64'
      )}
      collapsible
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!collapsed && <h1 className="font-bold text-lg">HabitTrack</h1>}
          <SidebarTrigger className="ml-2" />
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "px-4")}>
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path === '/dashboard' ? '/' : item.path}
                      className={getNavClass}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {!collapsed && <span>{item.label}</span>}
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
};

export default AppSidebar;
