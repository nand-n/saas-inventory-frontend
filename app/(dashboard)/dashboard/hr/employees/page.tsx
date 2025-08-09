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
import { exportToCSV, formatCurrency } from "@/lib/utils";
import { useEmployeeStore } from "@/store/hr/useEmployeeStore";
import { Employee, UserRole } from "@/types/hr.types";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import EmployeeForm from "../_components/employee-form";
import EmployeeStats from "../_components/employee-stats";
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
import EmployeeBulkActions from "../_components/employee-bulk-action";
import EmployeeFilters from "../_components/employee-filter";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import EmployeeDetails from "../_components/employee-detail";

export default function HrPage() {
  const {
    employees,
    filteredEmployees,
    isLoading,
    filters,
    stats,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    bulkDeleteEmployees,
    setFilters,
    clearFilters,
  } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const {
    data: departments = [],
    loading: departmentsLoading,
    execute: fetchdDepartments,
  } = useAsync(
    () => axiosInstance.get("departments").then((r) => r.data),
    true
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const sortedEmployees = useMemo(() => {
    if (!sortConfig) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? ""; // fallback for null/undefined
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  const handleSort = (key: keyof Employee) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleExport = () => {
    const exportData = employees.map((emp) => ({
      "Employee ID": emp.id,
      Name: emp.firstName + " " + emp.lastName,
      Email: emp.email,
      Phone: emp.phone,
      Position: emp.jobTitle,
      Salary: emp.salary,
      "Hire Date": emp.hireDate,
      Status: emp.status,
    }));

    exportToCSV(
      exportData,
      `employees-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Employees exported successfully!");
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // if (window.confirm("Are you sure you want to delete this employee?")) {
    await deleteEmployee(id);
    toast.success("Employee deleted successfully!");
    // }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select employees to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedEmployees.length} employee(s)?`
      )
    ) {
      await bulkDeleteEmployees(selectedEmployees);
      setSelectedEmployees([]);
      toast.success(
        `${selectedEmployees.length} employee(s) deleted successfully!`
      );
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === sortedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(sortedEmployees.map((emp) => emp.id));
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Employee Management"
          subtitle="Manage your employees and human resources"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
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
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <EmployeeForm
                  onSubmit={async (data) => {
                    await addEmployee(data);
                    setIsAddModalOpen(false);
                  }}
                  departments={departments}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>
      {/* Statistics */}
      <EmployeeStats stats={stats} />
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Employee Directory</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 min-w-0 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
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
              <EmployeeFilters
                filters={filters}
                onFiltersChange={setFilters}
                employees={employees}
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          {selectedEmployees.length > 0 && (
            <div className="mb-4">
              <EmployeeBulkActions
                selectedCount={selectedEmployees.length}
                onBulkDelete={handleBulkDelete}
                canDelete={true}
              />
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedEmployees.length === sortedEmployees.length &&
                          sortedEmployees.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Employee Number
                        {sortConfig?.key === "id" && (
                          <span className="ml-1 text-blue-600">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center">
                        First Name
                        {sortConfig?.key === "firstName" && (
                          <span className="ml-1 text-blue-600">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors hidden lg:table-cell"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center">
                        Department
                        {sortConfig?.key === "department" && (
                          <span className="ml-1 text-blue-600">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Position
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors hidden lg:table-cell"
                      onClick={() => handleSort("salary")}
                    >
                      <div className="flex items-center">
                        Salary
                        {sortConfig?.key === "salary" && (
                          <span className="ml-1 text-blue-600">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
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
                            Loading employees...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <Users className="h-16 w-16 text-gray-400" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              No employees found
                            </h3>
                            <p className="text-gray-500">
                              {searchTerm
                                ? "Try adjusting your search criteria"
                                : "Get started by adding your first employee"}
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
                    sortedEmployees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          selectedEmployees.includes(employee.id)
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleSelectEmployee(employee.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {employee.employeeNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-white">
                                {employee.firstName.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white truncate">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500 md:hidden truncate">
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-gray-900 dark:text-white">
                            {employee.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {employee?.department?.name}
                          </span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="text-gray-900 dark:text-white">
                            {employee.jobTitle}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(employee.salary ?? 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : employee.status === "inactive"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(employee)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <RoleGuard allowedRoles={[UserRole.ALL]}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(employee)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(employee.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          {sortedEmployees.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium">{sortedEmployees.length}</span> of{" "}
                <span className="font-medium">{employees.length}</span>{" "}
                employees
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              departments={departments}
              employee={selectedEmployee}
              onSubmit={async (data) => {
                await updateEmployee(selectedEmployee.id, data);
                setIsEditModalOpen(false);
                setSelectedEmployee(null);
                toast.success("Employee updated successfully!");
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedEmployee(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeDetails
              employee={selectedEmployee}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                handleEdit(selectedEmployee);
              }}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedEmployee(null);
              }}
              canEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
