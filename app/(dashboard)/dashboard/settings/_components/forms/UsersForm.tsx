"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import Modal from "@/components/ui/commons/modalWrapper";
import {
  User,
  UserFormData,
  UserStatus,
  Role,
  Branch,
  Department,
} from "@/types/user.types";

interface UsersFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  roles: Role[];
  branches: Branch[];
  departments: Department[];
  onSubmit: (values: UserFormData) => void;
  isLoading?: boolean;
}

const UsersForm: React.FC<UsersFormProps> = ({
  open,
  onOpenChange,
  user,
  roles,
  branches,
  departments,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<UserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roles: [],
      branchId: "",
      department: "",
      position: "",
      employeeId: "",
      status: "active",
      notes: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
      preferences: {
        language: "en",
        timezone: "UTC",
        notifications: {
          email: true,
          sms: false,
          push: false,
        },
      },
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        roles: user.roles,
        branchId: user.branchId || "",
        department: user.department?.name || "",
        position: user.position || "",
        employeeId: user.employeeId || "",
        status: user.status,
        notes: user.notes || "",
        emergencyContact: user.emergencyContact || {
          name: "",
          relationship: "",
          phone: "",
          email: "",
        },
        preferences: user.preferences || {
          language: "en",
          timezone: "UTC",
          notifications: {
            email: true,
            sms: false,
            push: false,
          },
        },
      });
    } else {
      form.reset();
    }
  }, [user, form]);

  const handleSubmit = (values: UserFormData) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Modal
      title={user ? "Update User" : "Create User"}
      description={user ? "Update user details" : "Add new user to the system"}
      onCancel={handleCancel}
      onConfirm={form.handleSubmit(handleSubmit)}
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...form.register("firstName", {
              required: "First name is required",
            })}
            error={form.formState.errors.firstName?.message}
          />
          <Input
            label="Last Name"
            {...form.register("lastName", {
              required: "Last name is required",
            })}
            error={form.formState.errors.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            {...form.register("email", { required: "Email is required" })}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Phone"
            {...form.register("phone")}
            error={form.formState.errors.phone?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Employee ID"
            {...form.register("employeeId")}
            error={form.formState.errors.employeeId?.message}
          />
          <Input
            label="Position"
            {...form.register("position")}
            error={form.formState.errors.position?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Branch"
            value={form.watch("branchId") || ""}
            onValueChange={(value) => form.setValue("branchId", value)}
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            placeholder="Select a branch"
          />
          <Selector
            label="Department"
            value={form.watch("department") || ""}
            onValueChange={(value) => form.setValue("department", value)}
            options={departments.map((dept) => ({
              value: dept.id,
              label: dept.name,
            }))}
            placeholder="Select a department"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Status"
            value={form.watch("status") || "active"}
            onValueChange={(value) =>
              form.setValue("status", value as UserStatus)
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "suspended", label: "Suspended" },
              { value: "pending", label: "Pending" },
              { value: "locked", label: "Locked" },
            ]}
            placeholder="Select status"
          />
          <Selector
            label="Roles"
            value={form.watch("roles")?.[0] || ""}
            onValueChange={(value) => form.setValue("roles", [value])}
            options={roles.map((role: Role) => ({
              value: role.id,
              label: role.name,
            }))}
            placeholder="Select a role"
          />
        </div>

        <div>
          <Input
            label="Notes"
            {...form.register("notes")}
            error={form.formState.errors.notes?.message}
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              {...form.register("emergencyContact.name")}
            />
            <Input
              label="Relationship"
              {...form.register("emergencyContact.relationship")}
            />
            <Input
              label="Contact Phone"
              {...form.register("emergencyContact.phone")}
            />
            <Input
              label="Contact Email"
              type="email"
              {...form.register("emergencyContact.email")}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UsersForm;
