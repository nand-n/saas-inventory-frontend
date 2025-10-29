import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccount } from "@/types/accounting.type";
import { AdjustmentType } from "@/types/payroll.types";
import { PlusCircle, Trash2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdjustmentsStepProps {
  accounts: ChartOfAccount[];
  adjustments: any[];
  onChange: (adjustments: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AdjustmentsStep({
  accounts,
  adjustments,
  onChange,
  onNext,
  onBack,
}: AdjustmentsStepProps) {
  const handleAdd = () => {
    onChange([
      ...adjustments,
      {
        type: AdjustmentType.BONUS,
        direction: "addition",
        amount: 0,
        reason: "",
        isRecurring: false,
        debitAccountId: "",
        creditAccountId: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(adjustments.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...adjustments];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Common Payroll Adjustments
        </CardTitle>
        <CardDescription>
          Define adjustments that will apply to all employees (optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {adjustments.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No adjustments added yet</p>
            <Button onClick={handleAdd} variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add First Adjustment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {adjustments.map((adj, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Adjustment #{index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type *</Label>
                        <Select
                          value={adj.type}
                          onValueChange={(value) => handleChange(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AdjustmentType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Direction *</Label>
                        <Select
                          value={adj.direction}
                          onValueChange={(value) => handleChange(index, "direction", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="addition">Addition (+)</SelectItem>
                            <SelectItem value="deduction">Deduction (-)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Amount *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={adj.amount}
                          onChange={(e) => handleChange(index, "amount", parseFloat(e.target.value))}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Reason *</Label>
                        <Input
                          value={adj.reason}
                          onChange={(e) => handleChange(index, "reason", e.target.value)}
                          placeholder="e.g., Holiday bonus"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Debit Account *</Label>
                        <Select
                          value={adj.debitAccountId}
                          onValueChange={(value) => handleChange(index, "debitAccountId", value)}
                        >
                          <SelectTrigger>
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
                      </div>

                      <div className="space-y-2">
                        <Label>Credit Account *</Label>
                        <Select
                          value={adj.creditAccountId}
                          onValueChange={(value) => handleChange(index, "creditAccountId", value)}
                        >
                          <SelectTrigger>
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
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`recurring-${index}`}
                        checked={adj.isRecurring}
                        onCheckedChange={(checked) => handleChange(index, "isRecurring", checked)}
                      />
                      <Label htmlFor={`recurring-${index}`} className="cursor-pointer">
                        Recurring adjustment
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {adjustments.length > 0 && (
          <Button onClick={handleAdd} variant="outline" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Another Adjustment
          </Button>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These adjustments will be applied to all selected employees.
            You can skip this step if no common adjustments are needed.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Next: Review & Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
