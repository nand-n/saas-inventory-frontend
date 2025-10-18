import React from 'react';
import { NavigationSubItem } from './navigations.type';

interface SubNavItemProps {
  item: NavigationSubItem;
  isActive: boolean;
  onNavigate: (href: string) => void;
}

export const SubNavItem: React.FC<SubNavItemProps> = ({
  item,
  isActive,
  onNavigate,
}) => {
  const Icon = item.icon;

  const baseClasses = `
    flex items-center w-full px-3 py-2 text-sm rounded-lg
    transition-all duration-200
  `;

  const activeClasses = isActive
    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 font-medium'
    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/30';

  return (
    <button
      onClick={() => onNavigate(item.href)}
      className={`${baseClasses} ${activeClasses}`}
    >
      <Icon className="h-4 w-4 mr-2.5 flex-shrink-0" />
      <span className="truncate">{item.name}</span>
    </button>
  );
};
