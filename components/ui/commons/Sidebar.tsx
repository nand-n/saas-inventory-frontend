"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  DollarSign,
  UserCog,
  Truck,
  Package,
  Warehouse,
  BarChart3,
  Menu,
  ChartBarIcon,
  ShoppingCartIcon,
  Settings,
  ChevronDown,
  ChevronUp,
  Banknote,
  TruckIcon,
  CreditCardIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CubeIcon } from "@radix-ui/react-icons";
import { useTenant } from "@/store/tenant/useTenant";
import useUserStore from "@/store/users/user.store";
import useTenantStore from "@/store/tenant/tenantStore";
import {
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    name: "HR",
    icon: UserCheck,
    children: [
      {
        name: "Employees",
        href: "/dashboard/hr/employees",
        icon: UserCheck,
      },
      {
        name: "Payroll",
        href: "/dashboard/hr/payroll",
        icon: Banknote,
      },
    ],
  },
  {
    name: "Departments",
    href: "/dashboard/departments",
    icon: Building2,
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: CubeIcon,
  },
  {
    name: "Finance",
    icon: DollarSign,
    children: [
      {
        name: "Accounting",
        href: "/dashboard/accounting",
        icon: ChartBarIcon,
      },
      {
        name: "Sales",
        href: "/dashboard/salse",
        icon: ShoppingCartIcon,
      },
    ],
  },
  {
    name: "CRM",
    href: "/crm",
    icon: UserCog,
  },
  // {
  //   name: "Procurement",
  //   icon: TruckIcon, // or any icon you like, e.g., Truck, ShoppingBag, etc.
  //   children: [
  //     {
  //       name: "Suppliers",
  //       href: "/dashboard/procurement/suppliers",
  //       icon: BuildingStorefrontIcon, // or any supplier-like icon
  //     },
  //     {
  //       name: "RFQ",
  //       href: "/dashboard/procurement/rfq",
  //       icon: DocumentTextIcon,
  //     },
  //     {
  //       name: "Purchase Orders",
  //       href: "/dashboard/procurement/purchase-orders",
  //       icon: ClipboardDocumentListIcon, // or any document/PO icon
  //     },
  //   ],
  // },
  // {
  //   name: "Export",
  //   icon: Truck,
  //   children: [
  //     {
  //       name: "Sales Orders",
  //       href: "/dashboard/export/salse-orders",
  //       icon: Truck,
  //     },
  //     {
  //       name: "Customers",
  //       href: "/dashboard/export/customers",
  //       icon: Truck,
  //     },
  //   ],
  // },

  {
    name: "Purchasing",
    icon: ShoppingCartIcon,
    children: [
      {
        name: "Suppliers",
        href: "/dashboard/procurement/suppliers",
        icon: BuildingStorefrontIcon,
      },
      {
        name: "RFQ",
        href: "/dashboard/procurement/rfq",
        icon: DocumentTextIcon,
      },
      {
        name: "Purchase Orders",
        href: "/dashboard/procurement/purchase-orders",
        icon: ClipboardDocumentListIcon,
      },
    ],
  },
  {
    name: "Sales & Customers",
    icon: CreditCardIcon,
    children: [
      {
        name: "Sales Orders",
        href: "/dashboard/export/salse-orders",
        icon: ClipboardDocumentCheckIcon,
      },
      {
        name: "Customers",
        href: "/dashboard/export/customers",
        icon: UserGroupIcon,
      },
    ],
  },

  {
    name: "Shipment",
    href: "/shipment",
    icon: Truck,
  },

  {
    name: "Logistics",
    href: "/logistics",
    icon: Package,
  },
  {
    name: "Warehouse",
    href: "/warehouse",
    icon: Warehouse,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const { name } = useTenantStore();
  return (
    <div
      className={cn(
        "bg-white scrollbar-hidden dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl whitespace-nowrap font-bold text-gray-900 dark:text-white">
            {name}
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* ✅ Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-4 px-2 pb-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.children) {
              const isOpen = openMenus[item.name] || true;

              return (
                <div key={item.name} className="mb-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>

                  {isOpen && !collapsed && (
                    <div className="ml-8 mt-1">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              "flex items-center px-4 py-2 text-sm rounded-lg mb-1",
                              isSubActive
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            )}
                          >
                            <SubIcon className="h-4 w-4 mr-2" />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
