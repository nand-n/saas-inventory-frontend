"use client";

import React from "react";
import {
  Edit,
  Calendar,
  DollarSign,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Payroll } from "@/types/payroll.types";

interface PayrollDetailsProps {
  payroll: Payroll;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

export default function PayrollDetails({ payroll, onEdit, onClose, canEdit }: PayrollDetailsProps) {
  const toNum = (v: any) => (v ? parseFloat(v) : 0);

  console.log(payroll ,"payrollpayrollpayroll")
  const grossPay = toNum(payroll.grossPay);
  const netPay = toNum(payroll.netPay);

  // ✅ Calculate adjustment totals
  const adjustmentTotals =
    payroll.adjustments?.reduce(
      (acc, adj) => {
        const amount = toNum(adj.amount);
        if (adj.direction === "addition") acc.additions += amount;
        else acc.deductions += amount;
        return acc;
      },
      { additions: 0, deductions: 0, net: 0 }
    ) || { additions: 0, deductions: 0, net: 0 };

  adjustmentTotals.net = adjustmentTotals.additions - adjustmentTotals.deductions;

  const statusBadge = () => {
    const variant =
      payroll.status === "paid"
        ? "bg-green-100 text-green-800"
        : payroll.status === "draft"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";
    return (
      <Badge variant="outline" className={variant}>
        {payroll.status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-3">
              Payroll Details {statusBadge()}
            </CardTitle>
            <CardDescription>
              {payroll.employee?.firstName} {payroll.employee?.lastName}
              {payroll.employee?.jobTitle && (
                <span className="text-sm"> • {payroll.employee.jobTitle}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <Button onClick={onEdit} size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gross Pay */}
        <Card>
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Gross Pay</p>
              <p className="text-3xl font-bold">{formatCurrency(grossPay)}</p>
              {payroll.hoursWorked && (
                <p className="text-xs text-muted-foreground">
                  {toNum(payroll.hoursWorked)}h worked
                </p>
              )}
            </div>
            <TrendingUp className="w-7 h-7 text-primary" />
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Adjustments (Deductions)</p>
              <p className="text-3xl font-bold text-destructive">
                -{formatCurrency(adjustmentTotals.deductions)}
              </p>
              <p className="text-xs text-muted-foreground">Total deductions</p>
            </div>
            <TrendingDown className="w-7 h-7 text-destructive" />
          </CardContent>
        </Card>

           <Card>
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Adjustments (Additions)</p>
              <p className="text-3xl font-bold text-green-500">
                -{formatCurrency(adjustmentTotals.additions)}
              </p>
              <p className="text-xs text-muted-foreground">Total Aditions</p>
            </div>
            <TrendingUp className="w-7 h-7 text-green-500" />
          </CardContent>
        </Card>

        {/* Net Pay */}
        <Card>
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="text-3xl font-bold">{formatCurrency(netPay)}</p>
              <p className="text-xs text-muted-foreground">Take-home amount</p>
            </div>
            <Wallet className="w-7 h-7 text-accent" />
          </CardContent>
        </Card>
      </div>

      {/* Pay Period & Pay Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pay Period</p>
              <p className="font-medium">
                {formatDate(payroll?.payPeriodStart)} – {formatDate(payroll?.payPeriodEnd)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pay Date</p>
              <p className="font-medium">{formatDate(payroll?.payDate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments */}
      {payroll.adjustments && payroll.adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Adjustments</span>
              <div className="text-sm flex gap-4">
                <span className="text-green-600">
                  +{formatCurrency(adjustmentTotals.additions)}
                </span>
                <span className="text-red-600">
                  -{formatCurrency(adjustmentTotals.deductions)}
                </span>
                <Separator orientation="vertical" className="h-6" />
                <span className="font-bold">
                  Net: {formatCurrency(adjustmentTotals.net)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {payroll.adjustments.map((adj, i) => (
              <div
                key={adj.id || i}
                className="flex justify-between items-start border p-3 rounded-md"
              >
                <div className="flex gap-3 items-start">
                  {adj.direction === "addition" ? (
                    <PlusCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <MinusCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold capitalize">{adj.type}</p>
                    {adj.reason && (
                      <p className="text-sm text-muted-foreground">{adj.reason}</p>
                    )}
                    <Badge
                      variant="outline"
                      className={
                        cn("uppercase text-xs" , 
  adj.approvalStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : adj.approvalStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"

                        )
                      
                      }
                    >
                      {adj.approvalStatus}
                    </Badge>
                  </div>
                </div>
                <p
                  className={`font-bold ${
                    adj.direction === "addition"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {adj.direction === "addition" ? "+" : "-"}
                  {formatCurrency(toNum(adj.amount))}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* System Info */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>System-generated payroll record details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">Employee ID</p>
            <p>{payroll.employeeId}</p>
          </div>
          {payroll.createdAt && (
            <div>
              <p className="text-muted-foreground font-medium">Created</p>
              <p>{formatDate(payroll.createdAt)}</p>
            </div>
          )}
          {payroll.updatedAt && (
            <div>
              <p className="text-muted-foreground font-medium">Updated</p>
              <p>{formatDate(payroll.updatedAt)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
