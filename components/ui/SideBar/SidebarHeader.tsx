import React from 'react';
import { Menu, X } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  companyName: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  onToggle,
  companyName,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-white dark:from-gray-800 dark:to-gray-800">
      {!collapsed && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {companyName}
          </h1>
        </div>
      )}
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
};
