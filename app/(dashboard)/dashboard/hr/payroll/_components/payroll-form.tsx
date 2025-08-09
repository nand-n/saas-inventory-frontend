// "use client";

// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Payroll } from "@/types/payroll.types";
// import { Employee } from "@/types/hr.types";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { ChartOfAccount } from "@/types/accounting.type";

// const schema = z.object({
//   employeeId: z.string().uuid({ message: "Employee is required" }),
//   payPeriodStart: z.string().min(1, "Pay period start is required"),
//   payPeriodEnd: z.string().min(1, "Pay period end is required"),
//   payDate: z.string().min(1, "Pay date is required"),
//   grossPay: z.coerce.number().min(0, "Gross pay must be >= 0"),
//   netPay: z.coerce.number().min(0, "Hours Worked must be >= 0"),
//   hoursWorked: z.coerce.number().min(0, "Net pay must be >= 0"),
//   federalTax: z.coerce.number().min(0).optional(),
//   stateTax: z.coerce.number().min(0).optional(),
//   socialSecurityTax: z.coerce.number().min(0).optional(),
//   medicareTax: z.coerce.number().min(0).optional(),
//   salaryExpenseAccountId: z.string().uuid({ message: "Required" }),
//   accruedPayrollLiabilityAccountId: z.string().uuid({ message: "Required" }),
//   taxesPayableAccountId: z.string().uuid({ message: "Required" }),
//   bankAccountId: z.string().uuid({ message: "Required" }),
//   status: z.enum(["draft", "paid", "cancelled"]).default("draft"),
// });

// type FormData = z.infer<typeof schema>;

// interface PayrollFormProps {
//   payroll?: Payroll;
//   employees: Employee[];
//   accounts: ChartOfAccount[];
//   onSubmit: (data: FormData) => Promise<void>;
//   onCancel: () => void;
// }

// export default function PayrollForm({
//   payroll,
//   employees,
//   accounts,
//   onSubmit,
//   onCancel,
// }: PayrollFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       employeeId: payroll?.employeeId || "",
//       payPeriodStart: payroll?.payPeriodStart || "",
//       payPeriodEnd: payroll?.payPeriodEnd || "",
//       payDate: payroll?.payDate || "",
//       grossPay: payroll?.grossPay || 0,
//       netPay: payroll?.netPay || 0,
//       federalTax: payroll?.federalTax || 0,
//       stateTax: payroll?.stateTax || 0,
//       socialSecurityTax: payroll?.socialSecurityTax || 0,
//       medicareTax: payroll?.medicareTax || 0,
//       salaryExpenseAccountId: payroll?.salaryExpenseAccountId || "",
//       accruedPayrollLiabilityAccountId:
//         payroll?.accruedPayrollLiabilityAccountId || "",
//       taxesPayableAccountId: payroll?.taxesPayableAccountId || "",
//       bankAccountId: payroll?.bankAccountId || "",
//       status: payroll?.status || "draft",
//     },
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Payroll Details</CardTitle>
//           <p>Set up pay period, amounts and accounts.</p>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>Employee *</Label>
//             <Select
//               value={watch("employeeId")}
//               onValueChange={(val) => setValue("employeeId", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Employee" />
//               </SelectTrigger>
//               <SelectContent>
//                 {employees.map((emp) => (
//                   <SelectItem key={emp.id} value={emp.id}>
//                     {emp.firstName} {emp.lastName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.employeeId && (
//               <p className="text-red-500 text-sm">
//                 {errors.employeeId.message}
//               </p>
//             )}
//           </div>

//           <Input
//             label="Pay Period Start *"
//             type="date"
//             {...register("payPeriodStart")}
//           />
//           <Input
//             label="Pay Period End *"
//             type="date"
//             {...register("payPeriodEnd")}
//           />
//           <Input label="Pay Date *" type="date" {...register("payDate")} />

//           <Input
//             label="Gross Pay *"
//             type="number"
//             step="0.01"
//             {...register("grossPay")}
//           />
//           <Input
//             label="Net Pay *"
//             type="number"
//             step="0.01"
//             {...register("netPay")}
//           />
//           <Input
//             label="Hours Worked *"
//             type="number"
//             step="0.1"
//             {...register("hoursWorked")}
//           />

//           <Input
//             label="Federal Tax"
//             type="number"
//             step="0.01"
//             {...register("federalTax")}
//           />
//           <Input
//             label="State Tax"
//             type="number"
//             step="0.01"
//             {...register("stateTax")}
//           />
//           <Input
//             label="Social Security Tax"
//             type="number"
//             step="0.01"
//             {...register("socialSecurityTax")}
//           />
//           <Input
//             label="Medicare Tax"
//             type="number"
//             step="0.01"
//             {...register("medicareTax")}
//           />

//           <div>
//             <Label>Salary Expense Account *</Label>
//             <Select
//               value={watch("salaryExpenseAccountId")}
//               onValueChange={(val) => setValue("salaryExpenseAccountId", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Expense Account" />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts
//                   ?.filter(
//                     (acc) => Number(acc.code) >= 5000 && Number(acc.code) < 6000
//                   )
//                   .map((acc) => (
//                     <SelectItem key={acc.id} value={acc.id}>
//                       {acc.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Accrued Payroll Liability Account *</Label>
//             <Select
//               value={watch("accruedPayrollLiabilityAccountId")}
//               onValueChange={(val) =>
//                 setValue("accruedPayrollLiabilityAccountId", val)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Liability Account" />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts
//                   ?.filter(
//                     (acc) => Number(acc.code) >= 2000 && Number(acc.code) < 3000
//                   )
//                   .map((acc) => (
//                     <SelectItem key={acc.id} value={acc.id}>
//                       {acc.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Taxes Payable Account *</Label>
//             <Select
//               value={watch("taxesPayableAccountId")}
//               onValueChange={(val) => setValue("taxesPayableAccountId", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Liability Account" />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts
//                   ?.filter(
//                     (acc) => Number(acc.code) >= 2000 && Number(acc.code) < 3000
//                   )
//                   .map((acc) => (
//                     <SelectItem key={acc.id} value={acc.id}>
//                       {acc.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Bank Account *</Label>
//             <Select
//               value={watch("bankAccountId")}
//               onValueChange={(val) => setValue("bankAccountId", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Bank Account" />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts
//                   ?.filter(
//                     (acc) => Number(acc.code) >= 1000 && Number(acc.code) < 2000
//                   )
//                   .map((acc) => (
//                     <SelectItem key={acc.id} value={acc.id}>
//                       {acc.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Status</Label>
//             <Select
//               value={watch("status")}
//               onValueChange={(val) =>
//                 setValue("status", val as FormData["status"])
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="draft">Draft</SelectItem>
//                 <SelectItem value="paid">Paid</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex justify-end space-x-4">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmitting}>
//           {payroll ? "Update Payroll" : "Create Payroll"}
//         </Button>
//       </div>
//     </form>
//   );
// }

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Payroll } from "@/types/payroll.types";
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
import { ChartOfAccount } from "@/types/accounting.type";

const schema = z.object({
  employeeId: z.string().uuid({ message: "Employee is required" }),
  payPeriodStart: z.string().min(1, "Pay period start is required"),
  payPeriodEnd: z.string().min(1, "Pay period end is required"),
  payDate: z.string().min(1, "Pay date is required"),
  grossPay: z.coerce.number().min(0, "Gross pay must be >= 0"),
  netPay: z.coerce.number().min(0, "Net pay must be >= 0"),
  hoursWorked: z.coerce.number().min(0, "Hours Worked must be >= 0"),
  federalTax: z.coerce.number().min(0).optional(),
  stateTax: z.coerce.number().min(0).optional(),
  socialSecurityTax: z.coerce.number().min(0).optional(),
  medicareTax: z.coerce.number().min(0).optional(),
  salaryExpenseAccountId: z.string().uuid({ message: "Required" }),
  accruedPayrollLiabilityAccountId: z.string().uuid({ message: "Required" }),
  taxesPayableAccountId: z.string().uuid({ message: "Required" }),
  bankAccountId: z.string().uuid({ message: "Required" }),
  status: z.enum(["draft", "paid", "cancelled"]).default("draft"),
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: payroll?.employeeId || "",
      payPeriodStart: payroll?.payPeriodStart || "",
      payPeriodEnd: payroll?.payPeriodEnd || "",
      payDate: payroll?.payDate || "",
      grossPay: payroll?.grossPay || 0,
      netPay: payroll?.netPay || 0,
      federalTax: payroll?.federalTax || 0,
      stateTax: payroll?.stateTax || 0,
      socialSecurityTax: payroll?.socialSecurityTax || 0,
      medicareTax: payroll?.medicareTax || 0,
      salaryExpenseAccountId: payroll?.salaryExpenseAccountId || "",
      accruedPayrollLiabilityAccountId:
        payroll?.accruedPayrollLiabilityAccountId || "",
      taxesPayableAccountId: payroll?.taxesPayableAccountId || "",
      bankAccountId: payroll?.bankAccountId || "",
      status: payroll?.status || "draft",
    },
  });

  const selectedEmployeeId = watch("employeeId");
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  useEffect(() => {
    if (selectedEmployee) {
      const gross = Number(selectedEmployee.salary) || 0;
      const hoursWorked = selectedEmployee.weeklyHours || 0;

      // Example simple flat-rate taxes
      const federalTax = gross * 0.1; // 10%
      const stateTax = gross * 0.05; // 5%
      const socialSecurityTax = gross * 0.062; // 6.2%
      const medicareTax = gross * 0.0145; // 1.45%

      const totalTaxes =
        federalTax + stateTax + socialSecurityTax + medicareTax;

      const netPay = gross - totalTaxes;

      setValue("grossPay", Number(gross.toFixed(2)));
      setValue("hoursWorked", hoursWorked);
      setValue("federalTax", Number(federalTax.toFixed(2)));
      setValue("stateTax", Number(stateTax.toFixed(2)));
      setValue("socialSecurityTax", Number(socialSecurityTax.toFixed(2)));
      setValue("medicareTax", Number(medicareTax.toFixed(2)));
      setValue("netPay", Number(netPay.toFixed(2)));
    }
  }, [selectedEmployeeId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Details</CardTitle>
          <p>Auto-calculate amounts based on selected employee.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Input
            label="Pay Period Start *"
            type="date"
            {...register("payPeriodStart")}
          />
          <Input
            label="Pay Period End *"
            type="date"
            {...register("payPeriodEnd")}
          />
          <Input label="Pay Date *" type="date" {...register("payDate")} />

          <Input
            label="Gross Pay *"
            type="number"
            step="0.01"
            {...register("grossPay")}
            disabled
          />
          <Input
            label="Net Pay *"
            type="number"
            step="0.01"
            {...register("netPay")}
            disabled
          />
          <Input
            label="Hours Worked *"
            type="number"
            step="0.1"
            {...register("hoursWorked")}
            disabled
          />

          <Input
            label="Federal Tax"
            type="number"
            step="0.01"
            {...register("federalTax")}
            disabled
          />
          <Input
            label="State Tax"
            type="number"
            step="0.01"
            {...register("stateTax")}
            disabled
          />
          <Input
            label="Social Security Tax"
            type="number"
            step="0.01"
            {...register("socialSecurityTax")}
            disabled
          />
          <Input
            label="Medicare Tax"
            type="number"
            step="0.01"
            {...register("medicareTax")}
            disabled
          />

          <div>
            <Label>Salary Expense Account *</Label>
            <Select
              value={watch("salaryExpenseAccountId")}
              onValueChange={(val) => setValue("salaryExpenseAccountId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Expense Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 5000 && Number(acc.code) < 6000
                  )
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Accrued Payroll Liability Account *</Label>
            <Select
              value={watch("accruedPayrollLiabilityAccountId")}
              onValueChange={(val) =>
                setValue("accruedPayrollLiabilityAccountId", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Liability Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 2000 && Number(acc.code) < 3000
                  )
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Taxes Payable Account *</Label>
            <Select
              value={watch("taxesPayableAccountId")}
              onValueChange={(val) => setValue("taxesPayableAccountId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Liability Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 2000 && Number(acc.code) < 3000
                  )
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bank Account *</Label>
            <Select
              value={watch("bankAccountId")}
              onValueChange={(val) => setValue("bankAccountId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bank Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  ?.filter(
                    (acc) => Number(acc.code) >= 1000 && Number(acc.code) < 2000
                  )
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

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

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {payroll ? "Update Payroll" : "Create Payroll"}
        </Button>
      </div>
    </form>
  );
}
