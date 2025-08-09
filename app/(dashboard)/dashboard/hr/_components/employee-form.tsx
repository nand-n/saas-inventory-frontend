"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types/hr.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
}

export default function EmployeeForm({
  employee,
  departments,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
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
          <Input label="First Name *" {...register("firstName")} />
          <Input label="Last Name *" {...register("lastName")} />
          <Input label="Middle Name" {...register("middleName")} />
          <Input label="Email *" type="email" {...register("email")} />
          <Input label="Phone *" {...register("phone")} />
          <Input label="Alternate Phone" {...register("alternatePhone")} />
          <Input
            label="Date of Birth"
            type="date"
            {...register("dateOfBirth")}
          />

          <div>
            <Label>Gender</Label>
            <Select
              value={watch("gender") || ""}
              onValueChange={(val) =>
                setValue("gender", val as FormData["gender"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>Marital Status</Label>
            <Select
              value={watch("maritalStatus") || ""}
              onValueChange={(val) =>
                setValue("maritalStatus", val as FormData["maritalStatus"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input label="National ID" {...register("nationalId")} />
          <Input
            label="Social Security Number"
            {...register("socialSecurityNumber")}
          />
          <Input label="Tax ID" {...register("taxId")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <p>Employment information and department.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Hire Date *" type="date" {...register("hireDate")} />
          <Input label="Job Title" {...register("jobTitle")} />

          <div>
            <Label>Status</Label>
            <Select
              value={watch("status") || ""}
              onValueChange={(val) =>
                setValue("status", val as FormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Employment Type</Label>
            <Select
              value={watch("employmentType") || ""}
              onValueChange={(val) =>
                setValue("employmentType", val as FormData["employmentType"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input label="Salary *" type="number" {...register("salary")} />
          <Input
            label="Hourly Rate"
            type="number"
            {...register("hourlyRate")}
          />
          <Input
            label="Weekly Hours"
            type="number"
            {...register("weeklyHours")}
          />

          <div>
            <Label>Department</Label>
            <Select
              value={watch("departmentId")}
              onValueChange={(val) => setValue("departmentId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <p>Employee’s home address information.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Street" {...register("street")} />
          <Input label="City" {...register("city")} />
          <Input label="State" {...register("state")} />
          <Input label="Zip Code" {...register("zipCode")} />
          <Input label="Country" {...register("country")} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
          <p>Payment and bank account information.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Bank Account" {...register("bankAccount")} />
          <Input label="Bank Name" {...register("bankName")} />
          <Input
            label="Bank Routing Number"
            {...register("bankRoutingNumber")}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <p>Person to contact in case of emergency.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" {...register("emergencyContactName")} />
          <Input
            label="Relationship"
            {...register("emergencyContactRelationship")}
          />
          <Input label="Phone" {...register("emergencyContactPhone")} />
          <Input
            label="Email"
            type="email"
            {...register("emergencyContactEmail")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
          <p>Employee’s company benefits and entitlements.</p>
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
            <Input type="number" {...register("paidTimeOff")} />
          </div>
          <div>
            <Label>Sick Leave (days)</Label>
            <Input type="number" {...register("sickLeave")} />
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
