import {
  LayoutDashboard,
  UserCheck,
  Building2,
  DollarSign,
  UserCog,
  Truck,
  Package,
  Warehouse,
  Settings,
  Banknote,
  ShoppingCart,
  CreditCard,
} from 'lucide-react';
import { NavigationItem } from './navigations.type';

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/overview/',
    icon: LayoutDashboard,
  },
  {
    name: 'HR',
    icon: UserCheck,
    children: [
      {
        name: 'Employees',
        href: '/dashboard/hr/employees/',
        icon: UserCheck,
      },
      {
        name: 'Payroll',
        href: '/dashboard/hr/payroll/',
        icon: Banknote,
      },
    ],
  },
  {
    name: 'Departments',
    href: '/dashboard/departments/',
    icon: Building2,
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory/',
    icon: Package,
  },
  {
    name: 'Finance',
    icon: DollarSign,
    children: [
      {
        name: 'Accounting',
        href: '/dashboard/accounting/',
        icon: DollarSign,
      },
      {
        name: 'Sales',
        href: '/dashboard/sales/',
        icon: ShoppingCart,
      },
    ],
  },
  {
    name: 'CRM',
    href: '/dashboard/crm/',
    icon: UserCog,
  },
  {
    name: 'Purchasing',
    icon: ShoppingCart,
    children: [
      {
        name: 'Suppliers',
        href: '/dashboard/procurement/suppliers/',
        icon: Building2,
      },
      {
        name: 'RFQ',
        href: '/dashboard/procurement/rfq/',
        icon: Package,
      },
      {
        name: 'Purchase Orders',
        href: '/dashboard/procurement/purchase-orders/',
        icon: Package,
      },
    ],
  },
  {
    name: 'Sales & Customers',
    icon: CreditCard,
    children: [
      {
        name: 'Sales Orders',
        href: '/dashboard/export/sales-orders/',
        icon: Package,
      },
      {
        name: 'Customers',
        href: '/dashboard/export/customers/',
        icon: UserCheck,
      },
    ],
  },
  {
    name: 'Shipment',
    href: '/dashboard/shipment/',
    icon: Truck,
  },
  {
    name: 'Logistics',
    href: '/dashboard/logistics/',
    icon: Package,
  },
  {
    name: 'Warehouse',
    href: '/dashboard/warehouse/',
    icon: Warehouse,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings/',
    icon: Settings,
  },
];
