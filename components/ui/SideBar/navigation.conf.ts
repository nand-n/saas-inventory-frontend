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
  Route,
  ClipboardList,
  FileSpreadsheet,
  Boxes,
  AlertTriangle,
  CalendarRange,
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
        name: 'Departments',
        href: '/dashboard/departments/',
        icon: Building2,
      },
      {
        name: 'Payroll',
        href: '/dashboard/hr/payroll/',
        icon: Banknote,
      },
    ],
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
    name: 'Planning',
    href: '/dashboard/planning/',
    icon: CalendarRange,
  },


    {
    name: 'Procurement',
    icon: ShoppingCart,
    children: [
      {
        name: 'Suppliers',
        href: '/dashboard/procurement/suppliers/',
        icon: Building2,
      },
      {
        name: 'RFQs',
        href: '/dashboard/procurement/rfq/',
        icon: ClipboardList,
      },
      {
        name: 'Purchase Orders',
        href: '/dashboard/procurement/purchase-orders/',
        icon: FileSpreadsheet,
      },
      {
        name: 'Goods Receipt',
        href: '/dashboard/procurement/goods-receipt/',
        icon: Boxes,
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
    name: 'Logistics',
    icon: Truck,
    children: [
      {
        name: 'Shipments',
        href: '/dashboard/shipment/',
        icon: Truck,
      },
      {
        name: 'Route & Delivery Tracking',
        href: '/dashboard/logistics/',
        icon: Route,
      },
    ],
  },
    {
    name: 'CRM',
    href: '/dashboard/crm/',
    icon: UserCog,
  },

      {
    name: 'Risks',
    href: '/dashboard/risks/',
    icon:  AlertTriangle,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings/',
    icon: Settings,
  },
];