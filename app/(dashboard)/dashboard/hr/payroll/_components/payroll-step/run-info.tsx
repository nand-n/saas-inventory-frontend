import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface RunInfoStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
}

/**
 * Utility function — normalize incoming date strings to "YYYY-MM-DD"
 * Handles both ISO dates ("2025-10-01T00:00:00.000Z") and "2025-10-01"
 */
function normalizeDate(value?: string): string {
  if (!value) return "";
  try {
    const date = new Date(value);
    // If invalid date, return as-is
    if (isNaN(date.getTime())) return value;
    return date.toISOString().split("T")[0]; // keep only "YYYY-MM-DD"
  } catch {
    return value;
  }
}

export default function RunInfoStep({
  data,
  onChange,
  onNext,
  onCancel,
}: RunInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.name && data.periodStart && data.periodEnd;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Payroll Run Information
        </CardTitle>
        <CardDescription>
          Enter the basic details for this payroll run
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Run Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Run Name *</Label>
          <Input
            id="name"
            placeholder="e.g., October 2025 Payroll"
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Period Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="periodStart">Period Start Date *</Label>
            <Input
              id="periodStart"
              type="date"
              value={normalizeDate(data.periodStart)}
              onChange={(e) => handleChange("periodStart", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodEnd">Period End Date *</Label>
            <Input
              id="periodEnd"
              type="date"
              value={normalizeDate(data.periodEnd)}
              onChange={(e) => handleChange("periodEnd", e.target.value)}
            />
          </div>
        </div>

        {/* Pay Date */}
        <div className="space-y-2">
          <Label htmlFor="payDate">Payment Date (Optional)</Label>
          <Input
            id="payDate"
            type="date"
            value={normalizeDate(data.payDate)}
            onChange={(e) => handleChange("payDate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            If not specified, the system will use the period end date.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Next: Select Employees
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
