import React from 'react';
import { NavigationItem } from './navigations.type';
import { NavItem } from './ NavItem';
import { SubNavItem } from './NubNavBar';

interface NavGroupProps {
  item: NavigationItem;
  currentPath: string;
  isOpen: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
}

export const NavGroup: React.FC<NavGroupProps> = ({
  item,
  currentPath,
  isOpen,
  collapsed,
  onToggle,
  onNavigate,
}) => {
  const isParentActive = item.children?.some((child) => child.href === currentPath);

  return (
    <div className="mb-1">
      <NavItem
        item={item}
        isActive={isParentActive || false}
        isOpen={isOpen}
        collapsed={collapsed}
        onClick={onToggle}
        onNavigate={onNavigate}
      />

      {isOpen && !collapsed && item.children && (
        <div className="ml-8 mt-1 space-y-1 overflow-hidden">
          {item.children.map((subItem) => (
            <SubNavItem
              key={subItem.name}
              item={subItem}
              isActive={currentPath === subItem.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
