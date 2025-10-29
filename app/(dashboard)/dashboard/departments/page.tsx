"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { Employee, UserRole } from "@/types/hr.types";
import { Plus, Edit, Trash2, Eye, Pencil, Trash, ChevronDown, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, useToast } from "@/hooks/use-toast";
import DepartmentForm from "./_components/DepartmentForm";
import DepartmentFilters from "./_components/DepartmentFilters";
import DepartmentDetail from "./_components/DepartmentDetail";
import DepartmentBulkActions from "./_components/DepartmentBulkActions";
import { Department, DepartmentFormData } from "@/types/department.types";
import { Branch } from "@/types/branchTypes.type";
import { User } from "@/types/user.types";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import useUserStore from "@/store/users/user.store";
import { ColumnDef } from "@tanstack/react-table";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { formatCurrency } from "@/lib/utils";
import { useDepartmentStore } from "@/store/departments/useDepartmentStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EmployeeForm from "../hr/_components/employee-form";
import { useEmployeeStore } from "@/store/hr/useEmployeeStore";

function DepartmentsPage() {

const { tenantId } = useUserStore();

const {
  branches,
  users,
  filteredDepartments,
  loading,
  fetchAll,
  filters,
  setFilters,
  addDepartment,
  editDepatment,
  deleteDepartment,
  bulkDelete,
  getManagerName,
  getBranchName,
  expanded,
  handleToggle,
  applyFilters,
  departments,
  fetchBranches, 
  fetchDepartments,
  fetchUsers,
  selectedDepartment, 
  selectedDepartments,
  setSelectedDepartment, 
  setSelectedDepartments,
  stats, 
} = useDepartmentStore();

  const {
    isLoading:employeeLoading,
    addEmployee,
  } = useEmployeeStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleAddDepartment = async (data: DepartmentFormData) => {
    try {
      await  addDepartment(tenantId , data)

      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Department added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
    } 
  };

  const handleEditDepartment = async (data: DepartmentFormData) => {
    if (!selectedDepartment) return;

    try {
      await editDepatment(tenantId , selectedDepartment.id , data)
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    } 
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
deleteDepartment(tenantId , id)
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDelete(tenantId, ids)
      toast({
        title: "Success",
        description: `${ids?.length} departments deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete departments",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    applyFilters();
  }, [filters, departments]);

useEffect(() => {
  if (tenantId) fetchAll(tenantId);
}, [tenantId]);

useEffect(() => {
  useDepartmentStore.getState().applyFilters();
}, [filters]);

  const departmentColumns: ColumnDef<Department>[] = [
    
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            const allIds = table
              .getFilteredRowModel()
              .rows.map((row) => row.original.id);
            setSelectedDepartments(allIds);
          } else {
            setSelectedDepartments([]);
          }
        }}
        checked={
          selectedDepartments.length ===
            table.getFilteredRowModel().rows.length &&
          table.getFilteredRowModel().rows.length > 0
        }
      />
    ),
    cell: ({ row }) => (
     <input
  type="checkbox"
  checked={selectedDepartments.includes(row.original.id)}
  onChange={(e) => {
    if (e.target.checked) {
      // Add the id
      const updated = [...selectedDepartments, row.original.id];
      setSelectedDepartments(updated);
    } else {
      // Remove the id
      const updated = selectedDepartments.filter(
        (id) => id !== row.original.id
      );
      setSelectedDepartments(updated);
    }
  }}
/>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "managerId",
    header: "Manager",
    cell: ({ row }) => getManagerName(row.original?.manager?.id ?? '-'),
  },
  {
    accessorKey: "branchId",
    header: "Branch",
    cell: ({ row }) => getBranchName(row.original.branchId),
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) =>
      `${formatCurrency(row.original.budget ?? 0)}`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const department = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedDepartment(department);
              setIsDetailModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDepartment(department);
                setIsEditModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteDepartment(department.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </RoleGuard>
        </div>
      );
    },
    
  },
  {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const department = row.original;
        const isOpen = expanded === department.id;
        return (
          <button
            onClick={() => handleToggle(department.id)}
            className="flex items-center justify-center"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight    className="h-4 w-4" />
            )}
          </button>
        );
      },
    },
]

const renderEmployeesTable = (department: Department) => {
  const columns: ColumnDef<Employee>[] = [
    { accessorKey: "employeeNumber", header: "Employee No." },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "jobTitle", header: "Job Title" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "default" : "secondary"}
          className="uppercase"
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) =>
        `${formatCurrency(row.original.salary ?? 0)}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="pl-10">
      <TableWrapper<Employee>
        columns={columns}
        data={department.employees || []}
        loading={false}
        title={`Employees in ${department.name}`}
        rightHeaderContent={
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
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
                  departmentId={department.id}

                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        }
      />
    </div>
  );
}
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Department Management"
          subtitle="Manage your organization's departments and structure"
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
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalBudget)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.averageBudget)}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <DepartmentFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() =>
          setFilters({
            search: "",
            isActive: undefined,
            branchId: "",
            managerId: "",
            parentDepartmentId: "",
          })
        }
        branches={branches ?? []}
        users={users ??[]}
        departments={departments ?? []}
      />

      {/* Bulk Actions */}
      {selectedDepartments.length > 0 && (
        <DepartmentBulkActions
          selectedDepartments={selectedDepartments}
          onBulkAction={(action) => {
            if (action.action === "delete") {
              handleBulkDelete(action.departmentIds);
            }
          }}
          branches={branches}
          users={users}
          departments={departments}
        />
      )}

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
  <TableWrapper<Department>
    columns={departmentColumns}
    data={filteredDepartments || []}
    loading={loading}
    title="Departments List"
   rowSubComponent={(department) =>
        expanded === department.id ? renderEmployeesTable(department) : null
      }

  />
</CardContent>
      </Card>

      {/* Add Department Modal */}
      <DepartmentForm
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        department={null}
        branches={branches}
        users={users}
        departments={departments}
        onSubmit={handleAddDepartment}
        isLoading={loading}
      />

      {/* Edit Department Modal */}
      <DepartmentForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        department={selectedDepartment}
        branches={branches}
        users={users}
        departments={departments}
        onSubmit={handleEditDepartment}
        isLoading={loading}
      />

      {/* Department Detail Modal */}
      {selectedDepartment && (
        <DepartmentDetail
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          department={selectedDepartment}
          onEdit={() => {
            setSelectedDepartment(selectedDepartment);
            setIsEditModalOpen(true);
          }}
          // branches={branches}
          // users={users}
          // departments={departments}
        />
      )}
    </div>
  );
}

export default DepartmentsPage;
