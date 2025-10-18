import { LucideIcon } from 'lucide-react';

export interface NavigationSubItem {
  name: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
}

export interface NavigationItem {
  name: string;
  href?: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  children?: NavigationSubItem[];
}
