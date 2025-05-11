"use client";
import { Avatar } from "@/components/avatar";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  // NavbarTitle,
} from "@/components/ui/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import useConfigurationStore from "@/store/tenant/configurationStore";
import useTenantStore from "@/store/tenant/tenantStore";
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  CubeIcon,
  HomeIcon,
  PlusIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { WarehouseIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function AccountDropdownMenu({
  anchor,
}: {
  anchor: "top start" | "bottom end";
}) {
  const [side, align] = anchor.split(" ") as [
    "top" | "bottom",
    "start" | "end"
  ];

  return (
    <DropdownMenuContent side={side} align={align} className="w-48">
      <DropdownMenuItem className="group hover:bg-blue-50 focus:bg-blue-50">
        <UserCircleIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600" />
        <DropdownMenuLabel className="text-gray-700">Profile</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-gray-100" />
      <DropdownMenuItem className="group hover:bg-blue-50 focus:bg-blue-50">
        <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600" />
        <DropdownMenuLabel className="text-gray-700">
          Settings
        </DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-gray-100" />
      <DropdownMenuItem className="group hover:bg-blue-50 focus:bg-blue-50">
        <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600" />
        <DropdownMenuLabel className="text-gray-700">Logout</DropdownMenuLabel>
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

  return (
    <SidebarLayout
      navbar={
        <Navbar className="bg-white border-b border-gray-200">
          <NavbarSection>
            <CardTitle className="text-gray-700 font-semibold">
              {pathname.split("/")[1]?.charAt(0).toUpperCase() +
                pathname.split("/")[1]?.slice(1) || "Dashboard"}
            </CardTitle>
          </NavbarSection>

          <NavbarSpacer />

          <NavbarSection className="space-x-4">
            <NavbarItem className="text-gray-600 hover:text-blue-600 transition-colors">
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
              <AccountDropdownMenu anchor="bottom end" />
            </DropdownMenu>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="bg-white border-r border-gray-200 w-64">
          <SidebarHeader className="p-4 border-b border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full group">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  {configData?.logo ? (
                    <Avatar
                      src={configData.logo}
                      className="ring-2 ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-10 w-10 bg-blue-100 rounded-lg">
                      <WarehouseIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <SidebarLabel className="text-gray-900 font-semibold block">
                      {configData?.name || "Inventory Pro"}
                    </SidebarLabel>
                    <span className="text-xs text-gray-500">
                      Supermarket Suite
                    </span>
                  </div>
                  <ChevronDownIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 ml-2">
                <DropdownMenuItem className="group">
                  <WarehouseIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600" />
                  <DropdownMenuLabel>Current Store</DropdownMenuLabel>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem className="group">
                  <PlusIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600" />
                  <DropdownMenuLabel>New Store Setup</DropdownMenuLabel>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>

          <SidebarBody className="p-2">
            <SidebarSection>
              <SidebarItem href="/" current={pathname === "/"}>
                <HomeIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/dashboard/inventory"
                current={pathname.startsWith("/inventory")}
              >
                <CubeIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Inventory</SidebarLabel>
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  2,345
                </span>
              </SidebarItem>
              <SidebarItem
                href="/dashboard/coa"
                current={pathname.startsWith("/coa")}
              >
                <CubeIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>COA</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/dashboard/salse"
                current={pathname.startsWith("/salse")}
              >
                <CubeIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Salse</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/suppliers"
                current={pathname.startsWith("/suppliers")}
              >
                <TruckIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Suppliers</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/orders"
                current={pathname.startsWith("/orders")}
              >
                <ShoppingCartIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Purchase Orders</SidebarLabel>
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                  15
                </span>
              </SidebarItem>
              <SidebarItem
                href="/analytics"
                current={pathname.startsWith("/analytics")}
              >
                <ChartBarIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer className="h-6" />

            <SidebarSection>
              <SidebarHeading className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2">
                Management
              </SidebarHeading>
              <SidebarItem
                href="/staff"
                current={pathname.startsWith("/staff")}
              >
                <UsersIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Staff Management</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/dashboard/settings"
                current={pathname.startsWith("/dashboard/settings")}
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="p-4 border-t border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full group">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar
                    src="/users/erica.jpg"
                    square
                    className="ring-2 ring-blue-500"
                  />
                  <div className="text-left">
                    <SidebarLabel className="text-gray-900 font-medium block">
                      Erica M.
                    </SidebarLabel>
                    <span className="text-xs text-gray-500">Store Manager</span>
                  </div>
                  <ChevronDownIcon className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </DropdownMenuTrigger>
              <AccountDropdownMenu anchor="top start" />
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </SidebarLayout>
  );
}
