"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/commons/modalWrapper";
import { Department, DepartmentFormData } from "@/types/department.types";
import { Branch } from "@/types/branchTypes.type";
import { User } from "@/types/user.types";

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  branches: Branch[];
  users: User[];
  departments: Department[];
  onSubmit: (values: DepartmentFormData) => void;
  isLoading?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  open,
  onOpenChange,
  department,
  branches = [],
  users =[],
  departments =[],
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      location: "",
      budget: undefined,
      isActive: true,
      parentDepartmentId: "",
      managerId: "",
      branchId: "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description || "",
        location: department.location || "",
        budget: department.budget,
        isActive: department.isActive,
        parentDepartmentId: department?.parentDepartment?.id || "",
        managerId: department.manager?.id || "",
        branchId: department.branchId,
      });
    } else {
      form.reset();
    }
  }, [department, form]);

  const handleSubmit = (values: DepartmentFormData) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Filter out current department from parent department options to prevent circular references
  const parentDepartmentOptions = departments
    ?.filter((dept: any) => dept.id !== department?.id)
    ?.map((dept: any) => ({
      value: dept.id,
      label: dept.name,
    }));

  return (
    <Modal
      title={department ? "Update Department" : "Create Department"}
      description={
        department
          ? "Update department details"
          : "Add new department to the system"
      }
      onCancel={handleCancel}
      onConfirm={form.handleSubmit(handleSubmit)}
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      isLoading={isLoading}
    >
      <div className="space-y-6 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Department Name"
            {...form.register("name", {
              required: "Department name is required",
            })}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="Department Code"
            {...form.register("code", {
              required: "Department code is required",
            })}
            error={form.formState.errors.code?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            {...form.register("location")}
            error={form.formState.errors.location?.message}
          />
          <Input
            label="Budget"
            type="number"
            step="0.01"
            {...form.register("budget", {
              valueAsNumber: true,
            })}
            error={form.formState.errors.budget?.message}
          />
        </div>

        <div>
          <Textarea
            label="Description"
            placeholder="Enter department description..."
            {...form.register("description")}
            error={form.formState.errors.description?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Branch"
            value={form.watch("branchId") || ""}
            onValueChange={(value) => form.setValue("branchId", value)}
            options={branches?.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
            placeholder="Select a branch"
            required
          />
          <Selector
            label="Parent Department"
            value={form.watch("parentDepartmentId") || ""}
            onValueChange={(value) =>
              form.setValue("parentDepartmentId", value)
            }
            options={[
              ...(parentDepartmentOptions || []),
            ]}
            placeholder="Select parent department"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Manager"
            value={form.watch("managerId") || ""}
            onValueChange={(value) => form.setValue("managerId", value)}
            options={[
              ...(users?.map((user) => ({
                value: user?.id,
                label: `${user?.firstName} ${user?.lastName}`,
              })) || []),
            ]}
            placeholder="Select a manager"
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Department</Label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentForm;
