'use client'
import React, { useState, useEffect, use } from 'react';
import { NavGroup } from './NavGroup';
import { navigationItems } from './navigation.conf';
import { NavItem } from './ NavItem';
import { SidebarHeader } from './SidebarHeader';
import { usePathname, useRouter } from 'next/navigation';
import useTenantStore from '@/store/tenant/tenantStore';

interface SidebarProps {
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
}) => {
  const { name:companyName } = useTenantStore();

  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const router = useRouter();
   const currentPath = usePathname() ;

  useEffect(() => {
    const initialOpenMenus: Record<string, boolean> = {};
    navigationItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.href == currentPath
        );
        initialOpenMenus[item.name] = hasActiveChild;
      }
    });
    setOpenMenus(initialOpenMenus);
  }, [currentPath]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const onNavigate = (path: string) => {
    router.push(path);
  }
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        companyName={companyName}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <nav className="px-3 py-4 space-y-1">
          {navigationItems.map((item) => {
            if (item.children) {
              return (
                <NavGroup
                  key={item.name}
                  item={item}
                  currentPath={currentPath}
                  isOpen={openMenus[item.name] || false}
                  collapsed={collapsed}
                  onToggle={() => toggleMenu(item.name)}
                  onNavigate={onNavigate}
                />
              );
            }

            return (
              <NavItem
                key={item.name}
                item={item}
                isActive={currentPath == item.href}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};
