


"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Employee } from "@/types/hr.types";
import { ChartOfAccount } from "@/types/accounting.type";
import { CreatePayrollRunDto, Payroll, PayrollRun, UpdatePayrollDto, UpdatePayrollRunDto } from "@/types/payroll.types";
import RunInfoStep from "./payroll-step/run-info";
import EmployeeSelectionStep from "./payroll-step/employee-section-step";
import AccountsConfigStep from "./payroll-step/accounts-config";
import AdjustmentsStep from "./payroll-step/adjestment-step";
import ReviewStep from "./payroll-step/review-step";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  periodStart: z.string().min(1, "Period start is required"),
  periodEnd: z.string().min(1, "Period end is required"),
  payDate: z.string().optional(),
  payrolls: z.array(z.any()).optional(),
  payrollIds: z.array(z.string().uuid()).optional(),
});

type FormData = z.infer<typeof schema>;

interface PayrollRunFormProps {
  employees: Employee[];
  accounts: ChartOfAccount[];
  existingPayrolls?: Payroll[];
  onSubmit: (data: CreatePayrollRunDto | UpdatePayrollRunDto) => Promise<void>;
  onCancel: () => void;
  run?: PayrollRun; // If present, we're in edit mode
}

export default function PayrollRunForm({
  employees,
  accounts,
  existingPayrolls = [],
  onSubmit,
  onCancel,
  run
}: PayrollRunFormProps) {
  const STEPS = [
    { id: 1, name: "Run Info", description: "Basic details" },
    { id: 2, name: "Select Employees", description: "Choose employees" },
    { id: 3, name: "Chart of Accounts", description: "Configure accounts" },
    { id: 4, name: "Adjustments", description: "Common adjustments" },
    { id: 5, name: "Review", description: "Confirm & submit" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePayrollRunDto>>({});
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [commonAccounts, setCommonAccounts] = useState<any>({});
  const [commonAdjustments, setCommonAdjustments] = useState<any[]>([]);

  // Prefill form if editing
  useEffect(() => {
    if (run) {
      setFormData({
        name: run.name,
        periodStart: run.periodStart,
        periodEnd: run.periodEnd,
        payDate: run.payDate,
      });

      setSelectedEmployees(
        run.payrolls?.map(p => ({
          ...p.employee,
          salary: Number(p.grossPay),
          weeklyHours: Number(p.hoursWorked),
        })) || []
      );

      if (run.payrolls && run.payrolls.length > 0) {
        const firstPayroll = run.payrolls[0];
        setCommonAccounts({
          salaryExpenseAccountId: firstPayroll.salaryExpenseAccountId,
          accruedPayrollLiabilityAccountId: firstPayroll.accruedPayrollLiabilityAccountId,
          taxesPayableAccountId: firstPayroll.taxesPayableAccountId,
          bankAccountId: firstPayroll.bankAccountId,
        });
      }

      // Collect adjustments from all payrolls (flattened)
      const adjustments: any[] = [];
      run.payrolls?.forEach(p => {
        p.adjustments?.forEach(adj => {
          adjustments.push({
            ...adj,
            amount: Number(adj.amount),
          });
        });
      });
      setCommonAdjustments(adjustments);
    }
  }, [run]);

  const handleNext = () => currentStep < STEPS.length && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmitFinal = async () => {
    const payload: CreatePayrollRunDto = {
      ...formData,
      name: formData.name || "",
      periodStart: formData.periodStart || "",
      periodEnd: formData.periodEnd || "",
      payDate: formData.payDate,
      payrolls: selectedEmployees.map(emp => ({
        employeeId: emp.id,
        payPeriodStart: formData.periodStart || "",
        payPeriodEnd: formData.periodEnd || "",
        payDate: formData.payDate || formData.periodEnd || "",
        grossPay: Number(emp.salary) || 0,
        netPay: Number(emp.salary) || 0,
        hoursWorked: Number(emp.weeklyHours),
        salaryExpenseAccountId: commonAccounts.salaryExpenseAccountId,
        accruedPayrollLiabilityAccountId: commonAccounts.accruedPayrollLiabilityAccountId,
        taxesPayableAccountId: commonAccounts.taxesPayableAccountId,
        bankAccountId: commonAccounts.bankAccountId,
        adjustments: commonAdjustments.map(adj => ({
          ...adj,
          employeeId: emp.id,
          amount: Number(adj.amount),
        })),
      })),
    };

    await onSubmit(payload);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Progress Steps */}
      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center space-y-2 flex-1">
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="text-center">
                    <p className={cn("text-sm font-medium", currentStep >= step.id ? "text-foreground" : "text-muted-foreground")}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-4 transition-colors", currentStep > step.id ? "bg-primary" : "bg-muted")} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && <RunInfoStep data={formData} onChange={setFormData} onNext={handleNext} onCancel={onCancel} />}
        {currentStep === 2 && <EmployeeSelectionStep employees={employees} selectedEmployees={selectedEmployees} onChange={setSelectedEmployees} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <AccountsConfigStep accounts={accounts} data={commonAccounts} onChange={setCommonAccounts} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <AdjustmentsStep accounts={accounts} adjustments={commonAdjustments} onChange={setCommonAdjustments} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 5 && <ReviewStep runInfo={formData} selectedEmployees={selectedEmployees} commonAccounts={commonAccounts} commonAdjustments={commonAdjustments} accounts={accounts} onSubmit={handleSubmitFinal} onBack={handleBack} />}
      </div>
    </div>
  );
}
