import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartOfAccount } from "@/types/accounting.type";
import { Building2 } from "lucide-react";

interface AccountsConfigStepProps {
  accounts: ChartOfAccount[];
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AccountsConfigStep({
  accounts,
  data,
  onChange,
  onNext,
  onBack,
}: AccountsConfigStepProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid =
    data.salaryExpenseAccountId &&
    data.accruedPayrollLiabilityAccountId &&
    data.taxesPayableAccountId &&
    data.bankAccountId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Chart of Accounts Configuration
        </CardTitle>
        <CardDescription>
          Select the default accounts to be used for all payrolls in this run
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salaryExpense">Salary Expense Account *</Label>
            <Select
              value={data.salaryExpenseAccountId || ""}
              onValueChange={(value) => handleChange("salaryExpenseAccountId", value)}
            >
              <SelectTrigger id="salaryExpense">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Debit account for salary expenses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payrollLiability">Accrued Payroll Liability *</Label>
            <Select
              value={data.accruedPayrollLiabilityAccountId || ""}
              onValueChange={(value) => handleChange("accruedPayrollLiabilityAccountId", value)}
            >
              <SelectTrigger id="payrollLiability">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Credit account for payroll liability
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxesPayable">Taxes Payable Account *</Label>
            <Select
              value={data.taxesPayableAccountId || ""}
              onValueChange={(value) => handleChange("taxesPayableAccountId", value)}
            >
              <SelectTrigger id="taxesPayable">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Account for tax withholdings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccount">Bank Account *</Label>
            <Select
              value={data.bankAccountId || ""}
              onValueChange={(value) => handleChange("bankAccountId", value)}
            >
              <SelectTrigger id="bankAccount">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Bank account for payments
            </p>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These accounts will be applied to all employees in this payroll run.
            You can override individual accounts later if needed.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Next: Add Adjustments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
