"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdjustmentDirection, AdjustmentType, PayrollAdjustment } from "@/types/payroll.types";
import { Employee } from "@/types/hr.types";
import { ChartOfAccount } from "@/types/accounting.type";
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
import { Selector } from "@/components/ui/select"; // assuming your custom <Selector /> is available

// ✅ Zod Schema
const adjustmentSchema = z.object({
  type: z.nativeEnum(AdjustmentType, { required_error: "Type is required" }),
  direction: z.nativeEnum(AdjustmentDirection, { required_error: "Direction is required" }),
  amount: z.coerce.number().min(0, "Amount must be greater than 0"),
  reason: z.string().optional(),
  debitAccountId: z.string().uuid({ message: "Debit Account is required" }),
  creditAccountId: z.string().uuid({ message: "Credit Account is required" }),
  employeeId: z.string().uuid({ message: "Employee is required" }),
  effectiveDate: z.string().optional(),
  isRecurring: z.boolean().default(false),
  policyCode: z.string().optional(),
});

export type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

interface PayrollAdjustmentFormProps {
  adjustment?: PayrollAdjustment;
  employees: Employee[];
  accounts: ChartOfAccount[];
  onSubmit: (data: AdjustmentFormData) => Promise<void>;
  onCancel: () => void;
  employeeId?:string
}

export default function PayrollAdjustmentForm({
  adjustment,
  employees,
  accounts,
  onSubmit,
  onCancel,
  employeeId
}: PayrollAdjustmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    watch,
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: (adjustment?.type as AdjustmentType) ?? AdjustmentType.BONUS,
      direction: (adjustment?.direction as AdjustmentDirection) ?? AdjustmentDirection.ADDITION,
      amount: adjustment?.amount || 0,
      reason: adjustment?.reason || "",
      debitAccountId: adjustment?.debitAccountId || "",
      creditAccountId: adjustment?.creditAccountId || "",
      employeeId: (adjustment?.employee?.id ?? employeeId)  ?? '',
      effectiveDate: adjustment?.effectiveDate || "",
      isRecurring: adjustment?.isRecurring || false,
      policyCode: adjustment?.policyCode || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {adjustment ? "Edit Payroll Adjustment" : "Add Payroll Adjustment"}
          </CardTitle>
          <p>Specify adjustment details for an employee.</p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee */}
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
              <p className="text-red-500 text-sm">{errors.employeeId.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label>Type *</Label>
            <Select
              value={watch("type")}
              onValueChange={(val) =>
                setValue("type", val as AdjustmentType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AdjustmentType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Direction */}
          <div>
            <Label>Direction *</Label>
            <Select
              value={watch("direction")}
              onValueChange={(val) =>
                setValue("direction", val as AdjustmentDirection)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Direction" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AdjustmentDirection).map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.direction && (
              <p className="text-red-500 text-sm">{errors.direction.message}</p>
            )}
          </div>

          {/* Amount */}
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm col-span-2">{errors.amount.message}</p>
          )}

          {/* Reason */}
          <Input
            label="Reason"
            type="text"
            placeholder="Reason or note"
            {...register("reason")}
          />

          {/* Effective Date */}
          <Input
            label="Effective Date"
            type="date"
            {...register("effectiveDate")}
          />

          {/* Policy Code */}
          <Input
            label="Policy Code"
            type="text"
            placeholder="Optional reference"
            {...register("policyCode")}
          />

          {/* Is Recurring */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isRecurring"
              {...register("isRecurring")}
            />
            <Label htmlFor="isRecurring">Recurring Adjustment</Label>
          </div>

          {/* Debit Account */}
          <Controller
            name="debitAccountId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 1000 && Number(acc.code) < 6000
                  ) // Assets & Expenses
                  .map((acc) => ({
                    value: acc.id,
                    label: acc.name,
                  }))}
                placeholder="Select Debit Account"
                label="Debit Account *"
                error={errors.debitAccountId?.message}
              />
            )}
          />

          {/* Credit Account */}
          <Controller
            name="creditAccountId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 2000 && Number(acc.code) < 4000
                  ) // Liabilities & Equity
                  .map((acc) => ({
                    value: acc.id,
                    label: acc.name,
                  }))}
                placeholder="Select Credit Account"
                label="Credit Account *"
                error={errors.creditAccountId?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {adjustment ? "Update Adjustment" : "Add Adjustment"}
        </Button>
      </div>
    </form>
  );
}
