"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRole } from "@/types/hr.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import EmployeeForm from "../hr/_components/employee-form";
import { Button } from "@/components/ui/button";

function DepartmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Department Management"
          subtitle="Manage your employees and human resources"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>
    </div>
  );
}

export default DepartmentsPage;
