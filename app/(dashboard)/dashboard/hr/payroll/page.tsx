"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { exportToCSV, formatCurrency, formatDate } from "@/lib/utils";
import { Download, Edit, Eye, Filter, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
// import PayrollDetails from "../_components/payroll-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import PayrollBulkActions from "../_components/payroll-bulk-actions";
// import PayrollFilters from "../_components/payroll-filters";
import { usePayrollStore } from "@/store/hr/usePayrollStore";
import PayrollForm from "./_components/payroll-form";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { Payroll } from "@/types/payroll.types";
import { UserRole } from "@/types/hr.types";
import PayrollBulkActions from "./_components/payroll-bulk-action";
import PayrollDetails from "./_components/payroll-detail";
import PayrollFilters from "./_components/payroll-filter";
import useTenantStore from "@/store/tenant/tenantStore";

export default function PayrollPage() {
  const {
    payrolls,
    filteredPayrolls,
    isLoading,
    filters,
    fetchPayrolls,
    addPayroll,
    updatePayroll,
    deletePayroll,
    bulkDeletePayrolls,
    setFilters,
    clearFilters,
  } = usePayrollStore();

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const { id: tenantid } = useTenantStore();
  const {
    data: employees = [],
    loading: employeesLoading,
    execute: fetchdEmployees,
  } = useAsync(() => axiosInstance.get("employees").then((r) => r.data), true);

  const {
    data: COAccounts = [],
    loading: COAccountsLoading,
    execute: fetchdCOAccounts,
  } = useAsync(
    () => axiosInstance.get("accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  const {
    data: departments = [],
    loading: departmentsLoading,
    execute: fetchDepartments,
  } = useAsync(
    () =>
      axiosInstance.get(`departments/tenant/${tenantid}`).then((r) => r.data),
    true
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payroll;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const sortedPayrolls = useMemo(() => {
    if (!sortConfig) return filteredPayrolls;

    return [...filteredPayrolls].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayrolls, sortConfig]);

  const handleSort = (key: keyof Payroll) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const exportData = payrolls.map((p) => ({
      "Payroll ID": p.id,
      Employee: `${p.employee.firstName} ${p.employee.lastName}`,
      "Pay Period": `${formatDate(p.payPeriodStart)} - ${formatDate(
        p.payPeriodEnd
      )}`,
      "Gross Pay": formatCurrency(p.grossPay),
      Taxes: formatCurrency(
        (p.federalTax || 0) +
          (p.stateTax || 0) +
          (p.socialSecurityTax || 0) +
          (p.medicareTax || 0)
      ),
      "Net Pay": formatCurrency(p.netPay),
      Status: p.status,
    }));

    exportToCSV(
      exportData,
      `payrolls-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Payrolls exported successfully!");
  };

  const handleView = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deletePayroll(id);
    toast.success("Payroll deleted successfully!");
  };

  const handleBulkDelete = async () => {
    if (selectedPayrolls.length === 0) {
      toast.error("Please select payrolls to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPayrolls.length} payroll(s)?`
      )
    ) {
      await bulkDeletePayrolls(selectedPayrolls);
      setSelectedPayrolls([]);
      toast.success(
        `${selectedPayrolls.length} payroll(s) deleted successfully!`
      );
    }
  };

  const handleSelectPayroll = (id: string) => {
    setSelectedPayrolls((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayrolls.length === sortedPayrolls.length) {
      setSelectedPayrolls([]);
    } else {
      setSelectedPayrolls(sortedPayrolls.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Payroll Management"
          subtitle="Manage payroll processing and payments"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}
          >
            <Button
              variant="outline"
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </RoleGuard>
          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Payroll</DialogTitle>
                </DialogHeader>
                <PayrollForm
                  accounts={COAccounts}
                  employees={employees}
                  onSubmit={async (data) => {
                    await addPayroll(data);
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Payroll List</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 min-w-0 sm:max-w-sm">
                <Input
                  placeholder="Search payrolls by employee..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-3"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="flex-1 sm:flex-none"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
          {isFiltersOpen && (
            <div className="mt-4">
              <PayrollFilters
                departments={departments}
                payrolls={payrolls}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {selectedPayrolls.length > 0 && (
            <div className="mb-4">
              <PayrollBulkActions
                selectedCount={selectedPayrolls.length}
                onBulkDelete={handleBulkDelete}
                canDelete={true}
              />
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedPayrolls.length === sortedPayrolls.length &&
                          sortedPayrolls.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      Payroll ID
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("employee")}
                    >
                      Employee
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("payPeriodStart")}
                    >
                      Pay Period
                    </TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Taxes</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="text-gray-500">
                            Loading payrolls...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedPayrolls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <Trash2 className="h-16 w-16 text-gray-400" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              No payrolls found
                            </h3>
                            <p className="text-gray-500">
                              {searchTerm
                                ? "Try adjusting your search criteria"
                                : "Add your first payroll record"}
                            </p>
                          </div>
                          {searchTerm && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSearch("")}
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPayrolls.map((payroll) => (
                      <TableRow
                        key={payroll.id}
                        className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          selectedPayrolls.includes(payroll.id)
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPayrolls.includes(payroll.id)}
                            onChange={() => handleSelectPayroll(payroll.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {payroll.id}
                        </TableCell>
                        <TableCell>
                          {payroll.employee.firstName}{" "}
                          {payroll.employee.lastName}
                        </TableCell>
                        <TableCell>
                          {formatDate(payroll.payPeriodStart)} -{" "}
                          {formatDate(payroll.payPeriodEnd)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(payroll.grossPay)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            (Number(payroll.federalTax) || 0) +
                              (Number(payroll.stateTax) || 0) +
                              (Number(payroll.socialSecurityTax) || 0) +
                              (Number(payroll.medicareTax) || 0)
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(payroll.netPay)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payroll.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : payroll.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payroll.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(payroll)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <RoleGuard
                              allowedRoles={[
                                UserRole.ADMIN,
                                UserRole.HR_MANAGER,
                                UserRole.ALL,
                              ]}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(payroll)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(payroll.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </RoleGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Info */}
          {sortedPayrolls.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium">{sortedPayrolls.length}</span> of{" "}
                <span className="font-medium">{payrolls.length}</span> payrolls
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <PayrollForm
              payroll={selectedPayroll}
              onSubmit={async (data) => {
                await updatePayroll(selectedPayroll.id, data);
                setIsEditModalOpen(false);
                setSelectedPayroll(null);
                toast.success("Payroll updated successfully!");
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedPayroll(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog> */}

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <PayrollDetails
              payroll={selectedPayroll}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                handleEdit(selectedPayroll);
              }}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedPayroll(null);
              }}
              canEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
