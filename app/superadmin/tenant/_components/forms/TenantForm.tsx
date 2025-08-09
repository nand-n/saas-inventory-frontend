"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenant, Tenant } from "@/store/tenant/useTenant";
import { Industry } from "@/store/Industry/useIndustry";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultData?: Partial<Tenant>;
  id?: string;
  industries: Industry[];
}

interface FormValues {
  name: string;
  numberOfBranches: number;
  industryType: string;
  tenantAdmin: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  config: {
    currency: string;
    timezone: string;
    locale: string;
  };
  isActive: boolean;
}

export default function TenantForm({
  open,
  setOpen,
  defaultData = {},
  id,
  industries = [],
}: Props) {
  const { createTenant, updateTenant } = useTenant();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: defaultData.name ?? "",
      numberOfBranches: Number(defaultData.numberOfBranches) ?? 1,
      industryType: defaultData.industryType ?? "",
      tenantAdmin: {
        firstName: defaultData.tenantAdmin?.firstName ?? "",
        lastName: defaultData.tenantAdmin?.lastName ?? "",
        email: defaultData.tenantAdmin?.email ?? "",
        phone: defaultData.tenantAdmin?.phone ?? "",
      },
      config: {
        currency: defaultData.config?.currency ?? "",
        timezone: defaultData.config?.timezone ?? "",
        locale: defaultData.config?.locale ?? "",
      },
      isActive: defaultData.isActive ?? true,
    },
  });

  useEffect(() => {
    reset({
      name: defaultData.name ?? "",
      numberOfBranches: defaultData.numberOfBranches ?? 1,
      industryType: defaultData.industryType ?? "",
      tenantAdmin: {
        firstName: defaultData.tenantAdmin?.firstName ?? "",
        lastName: defaultData.tenantAdmin?.lastName ?? "",
        email: defaultData.tenantAdmin?.email ?? "",
        phone: defaultData.tenantAdmin?.phone ?? "",
      },
      config: {
        currency: defaultData.config?.currency ?? "",
        timezone: defaultData.config?.timezone ?? "",
        locale: defaultData.config?.locale ?? "",
      },
      isActive: defaultData.isActive ?? true,
    });
  }, [defaultData, reset]);

  const onSubmit = async (data: FormValues) => {
    if (id) await updateTenant(id, data);
    else await createTenant(data);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={id ? "Edit Tenant" : "New Tenant"}
      description="Manage your tenant details"
      onCancel={() => setOpen(false)}
      onConfirm={handleSubmit(onSubmit)}
      size={"lg"}
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1 overflow-auto">
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Tenant Name"
          label="Tenant Name"
        />
        <Input
          type="number"
          {...register("numberOfBranches", {
            required: "Number of Branches",
            valueAsNumber: true,
          })}
          placeholder="Number of Branches"
          label="Number of Branches"
        />
        <div>
          <label className="block mb-1 text-sm font-medium">
            Industry Type
          </label>
          <Controller
            name="industryType"
            control={control}
            rules={{ required: "Industry type is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((option) => (
                    <SelectItem key={option.id} value={option.id ?? ""}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.industryType && (
            <p className="text-red-600 text-xs mt-1">
              {errors.industryType.message}
            </p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 border-t pt-4">
          <h3 className="text-lg font-bold mb-3">Tenant Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("tenantAdmin.firstName", { required: true })}
              placeholder="First Name"
              label="First Name"
            />
            <Input
              {...register("tenantAdmin.lastName", { required: true })}
              placeholder="Last Name"
              label="Last Name"
            />
            <Input
              {...register("tenantAdmin.email", { required: true })}
              placeholder="Email"
              label="Email"
            />
            <Input
              {...register("tenantAdmin.phone", { required: true })}
              placeholder="Phone"
              label="Phone"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 border-t pt-4">
          <h3 className="text-lg font-bold mb-3">Config</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("config.currency", { required: true })}
              placeholder="Currency"
              label="Currency"
            />
            <Input
              {...register("config.timezone", { required: true })}
              placeholder="Timezone"
              label="Timezone"
            />
            <Input
              {...register("config.locale", { required: true })}
              placeholder="Locale"
              label="Locale"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 col-span-1 md:col-span-2">
          <input id="isActive" type="checkbox" {...register("isActive")} />
          <label htmlFor="isActive" className="text-sm font-medium">
            Is Active?
          </label>
        </div>
      </form>
    </Modal>
  );
}
