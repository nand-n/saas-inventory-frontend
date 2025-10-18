import React from 'react';
import { ChevronDown } from 'lucide-react';
import { NavigationItem } from './navigations.type';

interface NavItemProps {
  item: NavigationItem;
  isActive: boolean;
  isOpen?: boolean;
  collapsed: boolean;
  onClick?: () => void;
  onNavigate?: (href: string) => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive,
  isOpen,
  collapsed,
  onClick,
  onNavigate,
}) => {
  const Icon = item.icon;
  const hasChildren = !!item.children;

  const handleClick = () => {
    if (hasChildren) {
      onClick?.();
    } else if (item.href) {
      onNavigate?.(item.href);
    }
  };

  const baseClasses = `
    flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
    transition-all duration-200 group relative
  `;

  const activeClasses = isActive
    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 shadow-sm'
    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50';

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${activeClasses}`}
      title={collapsed ? item.name : undefined}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />

      {!collapsed && (
        <>
          <span className="flex-1 text-left truncate">{item.name}</span>
          {hasChildren && (
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </>
      )}

      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {item.name}
        </div>
      )}
    </button>
  );
};
