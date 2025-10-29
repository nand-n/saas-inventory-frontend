"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types/hr.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Selector } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  alternatePhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  maritalStatus: z
    .enum(["single", "married", "divorced", "widowed", "separated"])
    .optional(),
  nationalId: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  taxId: z.string().optional(),
  hireDate: z.string().min(1, "Hire Date is required"),
  jobTitle: z.string().optional(),
  status: z.enum(["active", "inactive", "terminated"]).optional(),
  employmentType: z
    .enum(["full_time", "part_time", "contractor", "intern"])
    .optional(),
  salary: z.coerce.number().min(0, "Salary must be >= 0"),
  hourlyRate: z.coerce.number().min(0).optional(),
  weeklyHours: z.coerce.number().min(0).optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactEmail: z.string().optional(),
  healthInsurance: z.boolean().optional(),
  dentalInsurance: z.boolean().optional(),
  visionInsurance: z.boolean().optional(),
  lifeInsurance: z.boolean().optional(),
  retirementPlan: z.boolean().optional(),
  paidTimeOff: z.coerce.number().min(0).optional(),
  sickLeave: z.coerce.number().min(0).optional(),
  departmentId: z.string().uuid().optional(),
});

type FormData = z.infer<typeof schema>;

interface Department {
  id: string;
  name: string;
}

interface EmployeeFormProps {
  employee?: Employee;
  departments: Department[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  departmentId?: string
}

export default function EmployeeForm({
  employee,
  departments = [],
  onSubmit,
  onCancel,
  departmentId
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: {  errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      middleName: employee?.middleName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      alternatePhone: employee?.alternatePhone || "",
      dateOfBirth: employee?.dateOfBirth || "",
      gender: employee?.gender || "male",
      maritalStatus: employee?.maritalStatus || "single",
      nationalId: employee?.nationalId || "",
      socialSecurityNumber: employee?.socialSecurityNumber || "",
      taxId: employee?.taxId || "",
      hireDate: employee?.hireDate || "",
      jobTitle: employee?.jobTitle || "",
      status: employee?.status || "active",
      employmentType: employee?.employmentType || "full_time",
      salary: employee?.salary || 0,
      hourlyRate: employee?.hourlyRate || 0,
      weeklyHours: employee?.weeklyHours || 0,
      bankAccount: employee?.bankAccount || "",
      bankName: employee?.bankName || "",
      bankRoutingNumber: employee?.bankRoutingNumber || "",
      street: employee?.address?.street || "",
      city: employee?.address?.city || "",
      state: employee?.address?.state || "",
      zipCode: employee?.address?.zipCode || "",
      country: employee?.address?.country || "",
      emergencyContactName: employee?.emergencyContact?.name || "",
      emergencyContactRelationship:
        employee?.emergencyContact?.relationship || "",
      emergencyContactPhone: employee?.emergencyContact?.phone || "",
      emergencyContactEmail: employee?.emergencyContact?.email || "",
      healthInsurance: employee?.benefits?.healthInsurance ?? false,
      dentalInsurance: employee?.benefits?.dentalInsurance ?? false,
      visionInsurance: employee?.benefits?.visionInsurance ?? false,
      lifeInsurance: employee?.benefits?.lifeInsurance ?? false,
      retirementPlan: employee?.benefits?.retirementPlan ?? false,
      paidTimeOff: employee?.benefits?.paidTimeOff || 0,
      sickLeave: employee?.benefits?.sickLeave || 0,
      departmentId: employee?.departmentId || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <p>Personal and contact details.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name *"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
          <Input
            label="Middle Name"
            {...register("middleName")}
            error={errors.middleName?.message}
          />
          <Input
            label="Email *"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Phone *"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Input
            label="Alternate Phone"
            {...register("alternatePhone")}
            error={errors.alternatePhone?.message}
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register("dateOfBirth")}
            error={errors.dateOfBirth?.message}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value || ""}
                onValueChange={field.onChange}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                placeholder="Select Gender"
                label="Gender"
                error={errors.gender?.message}
              />
            )}
          />

          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value || ""}
                onValueChange={field.onChange}
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                  { value: "separated", label: "Separated" },
                ]}
                placeholder="Select Marital Status"
                label="Marital Status"
                error={errors.maritalStatus?.message}
              />
            )}
          />

          <Input
            label="National ID"
            {...register("nationalId")}
            error={errors.nationalId?.message}
          />
          <Input
            label="Social Security Number"
            {...register("socialSecurityNumber")}
            error={errors.socialSecurityNumber?.message}
          />
          <Input
            label="Tax ID"
            {...register("taxId")}
            error={errors.taxId?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <p>Employment information and department.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hire Date *"
            type="date"
            {...register("hireDate")}
            error={errors.hireDate?.message}
          />
          <Input
            label="Job Title"
            {...register("jobTitle")}
            error={errors.jobTitle?.message}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value || ""}
                onValueChange={field.onChange}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "terminated", label: "Terminated" },
                ]}
                placeholder="Select Status"
                label="Status"
                error={errors.status?.message}
              />
            )}
          />

          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value || ""}
                onValueChange={field.onChange}
                options={[
                  { value: "full_time", label: "Full Time" },
                  { value: "part_time", label: "Part Time" },
                  { value: "contractor", label: "Contractor" },
                  { value: "intern", label: "Intern" },
                ]}
                placeholder="Select Employment Type"
                label="Employment Type"
                error={errors.employmentType?.message}
              />
            )}
          />

          <Input
            label="Salary *"
            type="number"
            {...register("salary")}
            error={errors.salary?.message}
          />
          <Input
            label="Hourly Rate"
            type="number"
            {...register("hourlyRate")}
            error={errors.hourlyRate?.message}
          />
          <Input
            label="Weekly Hours"
            type="number"
            {...register("weeklyHours")}
            error={errors.weeklyHours?.message}
          />
{/* 
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value ?? ''} 
                onValueChange={field.onChange}
                options={departments.map((dept) => ({
                  value: dept.id,
                  label: dept.name,
                }))}
                placeholder="Select Department"
                label="Department"
                emptyMessage="No departments available"
                error={errors.departmentId?.message}
                
              />
            )}
          /> */}
          <Controller
  name="departmentId"
  control={control}
  render={({ field }) => {
    useEffect(() => {
      if (departmentId) {
        const exists = departments.some((d) => d.id === departmentId);
        if (exists && field.value !== departmentId) {
          field.onChange(departmentId); // updates the form and UI
        }
      }
    }, [departmentId, departments, field]);

    return (
      <Selector
        value={field.value ?? ""}
        onValueChange={(val) => field.onChange(val)} // keep UI & form in sync
        options={departments.map((dept) => ({
          value: dept.id,
          label: dept.name,
        }))}
        placeholder="Select Department"
        label="Department"
        emptyMessage="No departments available"
        error={errors.departmentId?.message}
      />
    );
  }}
/>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <p>Employee's home address information.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Street"
            {...register("street")}
            error={errors.street?.message}
          />
          <Input
            label="City"
            {...register("city")}
            error={errors.city?.message}
          />
          <Input
            label="State"
            {...register("state")}
            error={errors.state?.message}
          />
          <Input
            label="Zip Code"
            {...register("zipCode")}
            error={errors.zipCode?.message}
          />
          <Input
            label="Country"
            {...register("country")}
            error={errors.country?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
          <p>Payment and bank account information.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bank Account"
            {...register("bankAccount")}
            error={errors.bankAccount?.message}
          />
          <Input
            label="Bank Name"
            {...register("bankName")}
            error={errors.bankName?.message}
          />
          <Input
            label="Bank Routing Number"
            {...register("bankRoutingNumber")}
            error={errors.bankRoutingNumber?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <p>Person to contact in case of emergency.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            {...register("emergencyContactName")}
            error={errors.emergencyContactName?.message}
          />
          <Input
            label="Relationship"
            {...register("emergencyContactRelationship")}
            error={errors.emergencyContactRelationship?.message}
          />
          <Input
            label="Phone"
            {...register("emergencyContactPhone")}
            error={errors.emergencyContactPhone?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("emergencyContactEmail")}
            error={errors.emergencyContactEmail?.message}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
          <p>Employee's company benefits and entitlements.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              <input type="checkbox" {...register("healthInsurance")} /> Health
              Insurance
            </Label>
          </div>
          <div>
            <Label>
              <input type="checkbox" {...register("dentalInsurance")} /> Dental
              Insurance
            </Label>
          </div>
          <div>
            <Label>
              <input type="checkbox" {...register("lifeInsurance")} /> Life
              Insurance
            </Label>
          </div>
          <div>
            <Label>
              <input type="checkbox" {...register("retirementPlan")} />{" "}
              Retirement Plan
            </Label>
          </div>
          <div>
            <Label>Paid Time Off (days)</Label>
            <Input
              type="number"
              {...register("paidTimeOff")}
              error={errors.paidTimeOff?.message}
            />
          </div>
          <div>
            <Label>Sick Leave (days)</Label>
            <Input
              type="number"
              {...register("sickLeave")}
              error={errors.sickLeave?.message}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end items-center">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
