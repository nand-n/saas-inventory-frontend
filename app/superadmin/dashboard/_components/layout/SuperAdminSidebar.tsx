"use client";

import { ReactNode, useState, useEffect } from "react";
import useAuthStore from "@/store/auth/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiTag,
  FiCreditCard,
  FiList,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface Props {
  children: ReactNode;
}

export default function SuperAdminSidebar({ children }: Props) {
  const { clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() || "";

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const menuItems = [
    { href: "/superadmin/dashboard", label: "Dashboard", icon: <FiGrid /> },
    {
      href: "/superadmin/tenant",
      label: "Tenant",
      icon: <FiList />,
    },
    {
      href: "/superadmin/industry-type",
      label: "Industry Types",
      icon: <FiTag />,
    },
    {
      href: "/superadmin/payment-method",
      label: "Payment Methods",
      icon: <FiCreditCard />,
    },
    { href: "/superadmin/plan", label: "Plans", icon: <FiList /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-opacity-50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden text-white bg-gray-800 p-2 rounded-md shadow-md focus:outline-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-gray-800 text-white flex flex-col
          transition-transform duration-300 ease-in-out
          md:transition-[width] md:duration-300 md:ease-in-out
          transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          w-64
          ${collapsed ? "md:w-20" : "md:w-64"}
          flex-shrink-0
          shadow-lg
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2
            className={`text-xl font-bold whitespace-nowrap transition-opacity duration-300 ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Super Admin
          </h2>
          <div className="flex items-center gap-2">
            {/* Collapse toggle for desktop only */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1 hover:bg-gray-700 rounded focus:outline-none"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              {collapsed ? (
                <FiChevronRight size={20} />
              ) : (
                <FiChevronLeft size={20} />
              )}
            </button>

            {/* Close button for mobile only */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 hover:bg-gray-700 rounded focus:outline-none"
              aria-label="Close sidebar"
              type="button"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow gap-2 px-1 py-3 overflow-y-auto">
          {menuItems.map(({ href, label, icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-md px-4 py-2.5 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                  ${
                    isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-lg flex-shrink-0">{icon}</span>
                {!collapsed && (
                  <span className="text-sm truncate">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={clearAuth}
          className={`
            flex items-center gap-2 m-4 mt-auto p-2.5 rounded-md bg-red-600 hover:bg-red-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset
            ${collapsed ? "justify-center" : "justify-start"}
          `}
          type="button"
        >
          <FiLogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-margin duration-300 ease-in-out
          min-h-screen p-6 pt-16
          md:ml-64 md:pt-6
          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
