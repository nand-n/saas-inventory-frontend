import React from "react";
import {
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Payroll } from "@/types/payroll.types";

interface PayrollDetailsProps {
  payroll: Payroll;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({
  payroll,
  onEdit,
  onClose,
  canEdit,
}) => {
  const statusBadge = () => {
    switch (payroll.status) {
      case "draft":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Draft
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Paid
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payroll for {payroll.employee?.firstName}{" "}
            {payroll.employee?.lastName}
          </h2>
          {statusBadge()}
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Payroll Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pay Period
                </p>
                <p className="font-semibold">
                  {formatDate(payroll.payPeriodStart)} -{" "}
                  {formatDate(payroll.payPeriodEnd)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pay Date
                </p>
                <p className="font-semibold">{formatDate(payroll.payDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net Pay
                </p>
                <p className="font-semibold">
                  {formatCurrency(payroll.netPay)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax & Account Info */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Taxes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Federal Tax: {formatCurrency(payroll.federalTax ?? 0)}</p>
            <p>State Tax: {formatCurrency(payroll.stateTax ?? 0)}</p>
            <p>
              Social Security Tax:{" "}
              {formatCurrency(payroll.socialSecurityTax ?? 0)}
            </p>
            <p>Medicare Tax: {formatCurrency(payroll.medicareTax ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Salary Expense: {payroll.salaryExpenseAccountId}</p>
            <p>
              Accrued Payroll Liability:{" "}
              {payroll.accruedPayrollLiabilityAccountId}
            </p>
            <p>Taxes Payable: {payroll.taxesPayableAccountId}</p>
            <p>Bank Account: {payroll.bankAccountId}</p>
          </CardContent>
        </Card>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Taxes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span>Federal Tax</span>
              <span>{formatCurrency(payroll.federalTax ?? 0)}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>State Tax</span>
              <span>{formatCurrency(payroll.stateTax ?? 0)}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>Social Security Tax</span>
              <span>{formatCurrency(payroll.socialSecurityTax ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Medicare Tax</span>
              <span>{formatCurrency(payroll.medicareTax ?? 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span>Salary Expense</span>
              <span>{payroll.salaryExpenseAccountId}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>Accrued Payroll Liability</span>
              <span>{payroll.accruedPayrollLiabilityAccountId}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>Taxes Payable</span>
              <span>{payroll.taxesPayableAccountId}</span>
            </div>
            <div className="flex justify-between">
              <span>Bank Account</span>
              <span>{payroll.bankAccountId}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Created</p>
            <p className="font-medium">{formatDate(payroll.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
            <p className="font-medium">{formatDate(payroll.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollDetails;
