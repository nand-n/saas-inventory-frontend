"use client";

import { usePathname } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarLabel,
  SidebarItem,
  SidebarSection,
} from "@/components/ui/sidebar";
import {
  ChartBarIcon,
  HomeIcon,
  Settings,
  TruckIcon,
  UsersIcon,
  WarehouseIcon,
} from "lucide-react";
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import useTenantStore from "@/store/tenant/tenantStore";
import useConfigurationStore from "@/store/tenant/configurationStore";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { CubeIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  roles?: string[];
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    roles?: string[];
  }[];
};

export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <HomeIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/overview",
    roles: ["admin", "user", "all"],
  },
  {
    name: "Inventory",
    icon: <CubeIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/inventory",
    roles: ["admin", "user"],
  },
  {
    name: "COA",
    icon: <ChartBarIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/coa",
  },
  {
    name: "Accounting",
    icon: <ChartBarIcon className="w-5 h-5 text-gray-500" />, // Changed to accounting icon
    path: "/dashboard/accounting",
  },
  {
    name: "Finance",
    icon: <Cog6ToothIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/finance",
  },
  {
    name: "Sales",
    icon: <ShoppingCartIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/salse",
  },
  {
    name: "Suppliers",
    icon: <TruckIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/suppliers",
  },
  {
    name: "Customers",
    icon: <UsersIcon className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/customers",
  },
  {
    name: "Setrtings",
    icon: <Settings className="w-5 h-5 text-gray-500" />,
    path: "/dashboard/settings",
  },
];

function AccountDropdownMenu() {
  return (
    <DropdownMenuContent side="bottom" align="end" className="w-48">
      <DropdownMenuItem>
        <UserCircleIcon className="w-5 h-5 mr-2 text-gray-500" />
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500" />
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2 text-gray-500" />
        <DropdownMenuLabel>Logout</DropdownMenuLabel>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tenantID = "f99d3371-7406-4fa6-bd88-2ae24da29e5a";

  const { data: configData } = useAsync(
    () =>
      axiosInstance.get(`/tenants/${tenantID}`).then((res) => {
        const { configurations, industryType, ...tenantData } = res.data;
        useTenantStore.getState().setTenant({ ...tenantData, industryType });
        useConfigurationStore.getState().setConfigurations(configurations);
        return res.data;
      }),
    true
  );

  const currentPage =
    pathname.split("/")[1]?.charAt(0).toUpperCase() +
      pathname.split("/")[1]?.slice(1) || "Dashboard";
  const isActive = (path: string) => pathname === path;
  return (
    <SidebarLayout
      navbar={
        <Navbar className="bg-white border-b border-gray-200">
          <NavbarSection>
            <CardTitle className="text-gray-700 font-semibold">
              {currentPage}
            </CardTitle>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection className="space-x-4">
            <NavbarItem className="text-gray-600 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
            </NavbarItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <NavbarItem className="cursor-pointer">
                  <Avatar
                    src="/users/erica.jpg"
                    square
                    className="ring-2 ring-blue-500"
                  />
                </NavbarItem>
              </DropdownMenuTrigger>
              <AccountDropdownMenu />
            </DropdownMenu>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="bg-white border-r border-gray-200 w-64">
          <SidebarHeader className="p-4 border-b border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full group">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {configData?.logo ? (
                    <Avatar
                      src={configData.logo}
                      className="ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg">
                      <WarehouseIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <SidebarLabel className="font-semibold text-gray-900">
                      {configData?.name || "Inventory Pro"}
                    </SidebarLabel>
                    <p className="text-xs text-gray-500">Supermarket Suite</p>
                  </div>
                  <ChevronDownIcon className="ml-auto h-5 w-5 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 ml-2">
                <DropdownMenuItem>
                  <WarehouseIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <DropdownMenuLabel>Current Store</DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <DropdownMenuLabel>New Store Setup</DropdownMenuLabel>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>

          <SidebarBody className="p-2">
            <SidebarSection>
              {navItems.map(({ name, icon, path }) => (
                <SidebarItem
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(path ?? "")
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  key={name}
                  href={path}
                  current={isActive(path ?? "")}
                >
                  {icon}
                  <SidebarLabel>{name}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
