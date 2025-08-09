"use client";

import useUserStore from "@/store/users/user.store";
import { UserRole } from "@/types/hr.types";
import React, { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { roles } = useUserStore();
  const hasAccess =
    allowedRoles.includes(UserRole.ALL) ||
    roles.some((r) => allowedRoles.includes(r));
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
