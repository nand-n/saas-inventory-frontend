"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdjustmentDirection, AdjustmentType, Payroll } from "@/types/payroll.types";
import { Employee } from "@/types/hr.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  Selector,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartOfAccount } from "@/types/accounting.type";


// ✅ Adjustment schema
const adjustmentSchema = z.object({
  type: z.nativeEnum(AdjustmentType),
  direction: z.nativeEnum(AdjustmentDirection),
  amount: z.coerce.number().min(0, "Amount must be >= 0"),
  reason: z.string().optional(),
  debitAccountId: z.string().uuid({ message: "Required" }),
  employeeId: z.string().uuid({ message: "Required" }),
  creditAccountId: z.string().uuid({ message: "Required" }),
});

// ✅ Main Payroll schema
const schema = z.object({
  employeeId: z.string().uuid({ message: "Employee is required" }),
  payPeriodStart: z.string().min(1, "Pay period start is required"),
  payPeriodEnd: z.string().min(1, "Pay period end is required"),
  payDate: z.string().min(1, "Pay date is required"),
  grossPay: z.coerce.number().min(0, "Gross pay must be >= 0"),
  netPay: z.coerce.number().min(0, "Net pay must be >= 0"),
  hoursWorked: z.coerce.number().min(0, "Hours Worked must be >= 0"),

  salaryExpenseAccountId: z.string().uuid({ message: "Required" }),
  accruedPayrollLiabilityAccountId: z.string().uuid({ message: "Required" }),
  taxesPayableAccountId: z.string().uuid({ message: "Required" }),
  bankAccountId: z.string().uuid({ message: "Required" }),
  status: z.enum(["draft", "paid", "cancelled"]).default("draft"),
  adjustments: z.array(adjustmentSchema).optional(),
});

type FormData = z.infer<typeof schema>;

interface PayrollFormProps {
  payroll?: Payroll;
  employees: Employee[];
  accounts: ChartOfAccount[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function PayrollForm({
  payroll,
  employees,
  accounts,
  onSubmit,
  onCancel,
}: PayrollFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: payroll?.employeeId || "",
      payPeriodStart: payroll?.payPeriodStart || "",
      payPeriodEnd: payroll?.payPeriodEnd || "",
      payDate: payroll?.payDate || "",
      grossPay: payroll?.grossPay || 0,
      netPay: payroll?.netPay || 0,
      hoursWorked: payroll?.hoursWorked || 0,
      salaryExpenseAccountId: payroll?.salaryExpenseAccountId || "",
      accruedPayrollLiabilityAccountId:
        payroll?.accruedPayrollLiabilityAccountId || "",
      taxesPayableAccountId: payroll?.taxesPayableAccountId || "",
      bankAccountId: payroll?.bankAccountId || "",
      status: payroll?.status || "draft",
      adjustments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "adjustments",
  });

  const selectedEmployeeId = watch("employeeId");
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

const adjustments = watch("adjustments");

useEffect(() => {
  if (!adjustments || !Array.isArray(adjustments)) return;

  const gross = Number(selectedEmployee?.salary) || 0;
  const hoursWorked = selectedEmployee?.weeklyHours || 0;

  // Helper to sum by type
  const getTotalByType = (type: AdjustmentType) => {
    return adjustments
      .filter((adj) => adj.type === type)
      .reduce((sum, adj) => sum + Number(adj.amount || 0), 0);
  };

  // Calculate each adjustment type
  const bonus = getTotalByType(AdjustmentType.BONUS);
  const allowance = getTotalByType(AdjustmentType.ALLOWANCE);
  const overtime = getTotalByType(AdjustmentType.OVERTIME);
  const commission = getTotalByType(AdjustmentType.COMMISSION);
  const reimbursement = getTotalByType(AdjustmentType.REIMBURSEMENT);
  const tax = getTotalByType(AdjustmentType.TAX);
  const fine = getTotalByType(AdjustmentType.FINE);
  const loan = getTotalByType(AdjustmentType.LOAN);
  const advance = getTotalByType(AdjustmentType.ADVANCE);
  const other = getTotalByType(AdjustmentType.OTHER);

  // Additions and deductions
  const totalAdditions =
    bonus + allowance + overtime + commission + reimbursement + other;
  const totalDeductions = tax + fine + loan + advance;

  const netPay = gross + totalAdditions - totalDeductions;

  // Set all computed values
  setValue("grossPay", Number(gross.toFixed(2)));
  setValue("hoursWorked", hoursWorked);

  setValue("netPay", Number(netPay.toFixed(2)));
}, [adjustments, selectedEmployee, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Payroll Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Details</CardTitle>
          <p>Auto-calculate amounts based on selected employee.</p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee Selection */}
          <div>
            <Label>Employee *</Label>
            <Select
              value={watch("employeeId")}
              onValueChange={(val) => setValue("employeeId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-red-500 text-sm">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          {/* Other Inputs */}
          <Input label="Pay Period Start *" type="date" {...register("payPeriodStart")} />
          <Input label="Pay Period End *" type="date" {...register("payPeriodEnd")} />
          <Input label="Pay Date *" type="date" {...register("payDate")} />
          <Input label="Gross Pay *" type="number" step="0.01" {...register("grossPay")} disabled />
          <Input label="Net Pay *" type="number" step="0.01" {...register("netPay")} disabled />
          <Input label="Hours Worked *" type="number" step="0.1" {...register("hoursWorked")} disabled />

          {/* Account Selects */}
          {[
            {
              label: "Salary Expense Account *",
              name: "salaryExpenseAccountId",
              range: [5000, 6000],
            },
            {
              label: "Accrued Payroll Liability Account *",
              name: "accruedPayrollLiabilityAccountId",
              range: [2000, 3000],
            },
            {
              label: "Taxes Payable Account *",
              name: "taxesPayableAccountId",
              range: [2000, 3000],
            },
            { label: "Bank Account *", name: "bankAccountId", range: [1000, 2000] },
          ].map(({ label, name, range }) => (
            <div key={name}>
              <Label>{label}</Label>
              <Select
                value={watch(name as keyof FormData) as string}
                onValueChange={(val) => setValue(name as keyof FormData, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    ?.filter(
                      (acc) =>
                        Number(acc.code) >= range[0] && Number(acc.code) < range[1]
                    )
                    .map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(val) =>
                setValue("status", val as FormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Adjustments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Adjustments</CardTitle>
          <p>Add bonuses, commissions, or deductions.</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end border p-3 rounded-lg"
            >
              <Select
                value={field.type}
                onValueChange={(val) =>
                  setValue(`adjustments.${index}.type`, val as AdjustmentType)
                }
              >
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {Object.values(AdjustmentType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}initialData
                </SelectContent>
              </Select>

              <Select
                value={field.direction}
                onValueChange={(val) =>
                  setValue(`adjustments.${index}.direction`, val as AdjustmentDirection)
                }
              >
                <SelectTrigger><SelectValue placeholder="Direction" /></SelectTrigger>
                <SelectContent>
                  {Object.values(AdjustmentDirection).map((dir) => (
                    <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                step="0.01"
                placeholder="Amount"
                {...register(`adjustments.${index}.amount` as const)}
              />
              <Input
                type="text"
                placeholder="Reason"
                {...register(`adjustments.${index}.reason` as const)}
              />

              {/* Account selects */}{/* Debit Account */}
<Controller
  name={`adjustments.${index}.debitAccountId` as const}
  control={control}
  render={({ field }) => (
    <Selector
      value={field.value}
      onValueChange={field.onChange}
      options={accounts
        ?.filter((acc) => Number(acc.code) >= 1000 && Number(acc.code) < 6000) // Assets & Expenses
        .map((acc) => ({
          value: acc.id,
          label: acc.name,
        }))}
      placeholder="Select Debit Account"
      label="Debit Account *"
      error={errors.adjustments?.[index]?.debitAccountId?.message}
    />
  )}
/>

{/* Credit Account */}
<Controller
  name={`adjustments.${index}.creditAccountId` as const}
  control={control}
  render={({ field }) => (
    <Selector
      value={field.value}
      onValueChange={field.onChange}
      options={accounts
        ?.filter((acc) => Number(acc.code) >= 2000 && Number(acc.code) < 4000) // Liabilities & Equity
        .map((acc) => ({
          value: acc.id,
          label: acc.name,
        }))}
      placeholder="Select Credit Account"
      label="Credit Account *"
      error={errors.adjustments?.[index]?.creditAccountId?.message}
    />
  )}
/>

              

              <Button
                type="button"
                variant="destructive"
                className="col-span-1 col-start-2"
                onClick={() => remove(index)}
              >
                Remove Adjustment
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                type: AdjustmentType.BONUS,
                direction: AdjustmentDirection.ADDITION,
                amount: 0,
                employeeId: selectedEmployeeId,
                debitAccountId: "",
                creditAccountId: "",
              })
            }
          >
            + Add Adjustment
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          CancelinitialData
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {payroll ? "Update Payroll" : "Create Payroll"}
        </Button>
      </div>
    </form>
  );
}
