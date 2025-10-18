"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { Employee, UserRole } from "@/types/hr.types";
import { Plus, Edit, Trash2, Eye, Pencil, Trash, ChevronDown, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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

function DepartmentsPage() {
  const { tenantId: TenantId } = useUserStore();
 const {
    data: branches = [],
    loading: isbranchesLoading,
    execute: fetchbranches,
  } = useAsync(
    () => axiosInstance.get(`/branches/${TenantId}`).then((res) => res.data),
    false
  );

   const {
    data: departments = [],
    loading: isDepartmentsLoading,
    execute: fetchDepartments,
  } = useAsync(
    // Corrected endpoint from /branches/ to /departments/ (adjust if necessary)
    () => axiosInstance.get(`/departments/tenant/${TenantId}`).then((res) => res.data),
    false
  );

   const {
    data: users = [],
    loading: isUsersLoading,
    execute: fetchUsers,
  } = useAsync(
    () =>
      axiosInstance.get(`/users/tenant/${TenantId}`).then((res) => res.data),
    false
  );
  // const [departments, setDepartments] = useState<any[]>(departments);
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

 useEffect(() => {
    if (TenantId) {
      fetchbranches();
      fetchUsers();
      fetchDepartments(); 
    }
  }, [TenantId]);
  const [filters, setFilters] = useState({
    search: "",
    isActive: undefined,
    branchId: "",
    managerId: "",
    parentDepartmentId: "",
  } as any);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const { toast } = useToast();

  // Stats calculation
  const stats = {
    total: departments?.length ?? 0,
    active: departments?.filter((d: any) => d.isActive).length ?? 0,
    inactive: departments?.filter((d: any) => !d.isActive).length ?? 0,
    totalBudget: departments?.reduce(
      (sum: any, d: any) => sum + (d.budget || 0),
      0
    ),
    averageBudget:
      departments?.length > 0
        ? departments?.reduce((sum: any, d: any) => sum + (d.budget || 0), 0) /
          departments?.length
        : 0,
  };

  const handleAddDepartment = async (data: DepartmentFormData) => {
    setIsLoading(true);
    try {
      // // Mock API call - replace with actual API
      // const newDepartment: Department = {
      //   id: Date.now().toString(),
      //   ...data,
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      //   deletedAt: null,
      //   createdByUser: "1",
      //   updatedBy: "1",
      // };

      // setDepartments((prev) => [...prev, newDepartment]);
      // setFilteredDepartments((prev) => [...prev, newDepartment]);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDepartment = async (data: DepartmentFormData) => {
    if (!selectedDepartment) return;

    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      const updatedDepartment = {
        ...selectedDepartment,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      // setDepartments((prev) =>
      //   prev.map((d) =>
      //     d.id === selectedDepartment.id ? updatedDepartment : d
      //   )
      // );
      setFilteredDepartments((prev) =>
        prev.map((d) =>
          d.id === selectedDepartment.id ? updatedDepartment : d
        )
      );
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      // Mock API call - replace with actual API
      // setDepartments((prev) => prev.filter((d) => d.id !== id));
      setFilteredDepartments((prev) => prev.filter((d) => d.id !== id));
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
      // Mock API call - replace with actual API
      // setDepartments((prev) => prev.filter((d) => !ids.includes(d.id)));
      setFilteredDepartments((prev) => prev.filter((d) => !ids.includes(d.id)));
      setSelectedDepartments([]);
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

  const applyFilters = () => {
    let filtered = [...(departments || [])];

    if (filters.search) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          dept.code.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter((dept) => dept.isActive === filters.isActive);
    }

    if (filters.branchId) {
      filtered = filtered.filter((dept) => dept.branchId === filters.branchId);
    }

    if (filters.managerId) {
      filtered = filtered.filter(
        (dept) => dept.managerId === filters.managerId
      );
    }

    if (filters.parentDepartmentId) {
      filtered = filtered.filter(
        (dept) => dept.parentDepartmentId === filters.parentDepartmentId
      );
    }

    setFilteredDepartments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, departments]);

  const getManagerName = (managerId: string) => {
    const user = users?.find((u: any) => u.id === managerId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown";
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find((b: Branch) => b.id === branchId);
    return branch ? branch.name : "Unknown";
  };

    const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

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
            setSelectedDepartments((prev) => [...prev, row.original.id]);
          } else {
            setSelectedDepartments((prev) =>
              prev.filter((id) => id !== row.original.id)
            );
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
          <Button
            onClick={() =>
              console.log("Add employee to", department.id)
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
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
      {/* <DepartmentFilters
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
        branches={branches}
        users={users}
        departments={departments}
      /> */}

      {/* Bulk Actions */}
      {selectedDepartments.length > 0 && (
        <DepartmentBulkActions
          selectedDepartments={selectedDepartments}
          onBulkAction={(action) => {
            if (action.action === "delete") {
              handleBulkDelete(action.departmentIds);
            }
            // Handle other actions as needed
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
    loading={isLoading}
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
        isLoading={isLoading}
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
        isLoading={isLoading}
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
    // <></>
  );
}

export default DepartmentsPage;
