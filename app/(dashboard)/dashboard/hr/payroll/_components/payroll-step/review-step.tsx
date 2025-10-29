import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/hr.types";
import { ChartOfAccount } from "@/types/accounting.type";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PayrollAdjustment, AdjustmentType } from "@/types/payroll.types";

interface ReviewStepProps {
  runInfo: any;
  selectedEmployees: Employee[];
  commonAccounts: any;
  commonAdjustments: PayrollAdjustment[];
  accounts: ChartOfAccount[];
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

// 🧩 Utility: determine if an adjustment type is percentage-based
function isPercentageAdjustment(adj: PayrollAdjustment): boolean {
  switch (adj.type) {
    case AdjustmentType.TAX:
    case AdjustmentType.COMMISSION:
      return true;
    case AdjustmentType.OVERTIME:
      return Boolean(adj.metadata?.isPercentage);
    default:
      return false;
  }
}

export default function ReviewStep({
  runInfo,
  selectedEmployees,
  commonAccounts,
  commonAdjustments,
  accounts,
  onSubmit,
  onBack,
}: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountName = (id?: string) => {
    if (!id) return "Unknown";
    const account = accounts.find((a) => a.id === id);
    return account ? `${account.code} - ${account.name}` : "Unknown";
  };

  // 🧮 Per-employee calculation
  const perEmployeeCalculations = selectedEmployees.map((emp) => {
    const salary = Number(emp.salary) || 0;

    const perEmpAdjustment = commonAdjustments.reduce((acc, adj) => {
      const raw = Number(adj?.amount ?? 0);
      const isPercent = isPercentageAdjustment(adj);
      const adjAmount = isPercent ? salary * (raw / 100) : raw;
      const signed = adj.direction === "addition" ? adjAmount : -adjAmount;
      return acc + signed;
    }, 0);

    const netPay = salary + perEmpAdjustment;

    return {
      employeeId: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      jobTitle: emp.jobTitle,
      salary,
      perEmpAdjustment,
      netPay,
    };
  });

  // 🧾 Totals
  const totalGrossPay = perEmployeeCalculations.reduce((s, e) => s + e.salary, 0);
  const totalAdjustments = perEmployeeCalculations.reduce((s, e) => s + e.perEmpAdjustment, 0);
  const estimatedTotal = totalGrossPay + totalAdjustments;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Review Payroll Run
          </CardTitle>
          <CardDescription>Please review all details before submitting</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Run Info */}
          <div>
            <h3 className="font-semibold mb-3">Run Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{runInfo.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Period</p>
                <p className="font-medium">
                  {runInfo.periodStart} to {runInfo.periodEnd}
                </p>
              </div>
              {runInfo.payDate && (
                <div>
                  <p className="text-muted-foreground">Pay Date</p>
                  <p className="font-medium">{runInfo.payDate}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Employees */}
          <div>
            <h3 className="font-semibold mb-3">Selected Employees ({selectedEmployees.length})</h3>
            <div className="border rounded-lg divide-y max-h-[260px] overflow-y-auto">
              {perEmployeeCalculations.map((e) => (
                <div key={e.employeeId} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{e.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Adj: {formatCurrency(e.perEmpAdjustment)} • Net: {formatCurrency(e.netPay)}
                    </p>
                  </div>
                  <Badge variant="secondary">{formatCurrency(e.salary)}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Chart of Accounts */}
          <div>
            <h3 className="font-semibold mb-3">Chart of Accounts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salary Expense:</span>
                <span className="font-medium">{getAccountName(commonAccounts.salaryExpenseAccountId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payroll Liability:</span>
                <span className="font-medium">{getAccountName(commonAccounts.accruedPayrollLiabilityAccountId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes Payable:</span>
                <span className="font-medium">{getAccountName(commonAccounts.taxesPayableAccountId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Account:</span>
                <span className="font-medium">{getAccountName(commonAccounts.bankAccountId)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Adjustments */}
          <div>
            <h3 className="font-semibold mb-3">Common Adjustments ({commonAdjustments.length})</h3>
            {commonAdjustments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No common adjustments</p>
            ) : (
              <div className="space-y-2">
                {commonAdjustments.map((adj, index) => {
                  const isPercent = isPercentageAdjustment(adj);
                  return (
                    <div key={index} className="border rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {adj.type}
                          </Badge>
                          <p className="font-medium">{adj.reason}</p>
                        </div>
                        <p
                          className={`font-semibold ${
                            adj.direction === "addition" ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {adj.direction === "addition" ? "+" : "-"}{" "}
                          {isPercent ? `${Number(adj.amount)}%` : formatCurrency(Number(adj.amount ?? 0))}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {adj.isRecurring && "Recurring • "}
                        Dr: {getAccountName(adj.debitAccountId)} / Cr: {getAccountName(adj.creditAccountId)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Payroll Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Gross Pay:</span>
                <span className="font-semibold">{formatCurrency(totalGrossPay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Adjustments:</span>
                <span className={`font-semibold ${totalAdjustments >= 0 ? "text-green-200" : "text-destructive"}`}>
                  {totalAdjustments >= 0 ? "+" : ""}{formatCurrency(totalAdjustments)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Estimated Total:</span>
                <span className="font-bold text-primary">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Important</p>
              <p className="text-muted-foreground">
                Once submitted, this payroll run will be created in draft status. You can review and process it from the payroll dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? "Creating..." : "Create Payroll Run"}
        </Button>
      </div>
    </div>
  );
}
