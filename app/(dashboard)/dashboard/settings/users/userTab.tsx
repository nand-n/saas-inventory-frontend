"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import Modal from "@/components/ui/commons/modalWrapper";
import { useToast } from "@/components/ui/commons/toastProvider";
import { handleApiError } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import useTenantStore from "@/store/tenant/tenantStore";
import {
  User,
  UserFormData,
  UserStatus,
  Role,
  Branch,
  Department,
} from "@/types/user.types";
import {
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Building,
  Users,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UsersForm from "../_components/forms/UsersForm";

const UserTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const tenantId = useTenantStore((state) => state.id);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchBranches();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/tenant/${tenantId}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("destructive", "Error!", handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(`/users/roles/${tenantId}`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get(`/branches/${tenantId}`);
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get(
        `/departments/tenant/${tenantId}`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (selectedUser) {
        await axiosInstance.put(`/users/${selectedUser.id}`, values);
        showToast("default", "Success!", "User updated successfully");
      } else {
        await axiosInstance.post(`/users/${tenantId}`, values);
        showToast("default", "Success!", "User created successfully");
      }
      fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      showToast("destructive", "Error!", handleApiError(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        showToast("default", "Success!", "User deleted successfully");
        fetchUsers();
      } catch (error) {
        showToast("destructive", "Error!", handleApiError(error));
      }
    }
  };

  const handleBulkAction = async (
    userIds: string[],
    action: string,
    value?: string
  ) => {
    try {
      await axiosInstance.post(`/users/bulk-action`, {
        userIds,
        action,
        value,
      });
      showToast("default", "Success!", "Bulk action completed successfully");
      fetchUsers();
    } catch (error) {
      showToast("destructive", "Error!", handleApiError(error));
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => {
        console.log(row.original, "row");
        const { lastName, email } = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">
                {row.getValue("firstName")}
                {lastName ?? "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                {email ?? "-"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{row.getValue("phone") || "-"}</span>
        </div>
      ),
    },

    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.getValue("roles") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {roles?.map((role: string) => (
              <span
                key={role}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {role}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 min-w-32">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="line-clamp-1">
            {row.getValue("branchName") || "Not assigned"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const { department } = row.original;
        return (
          <div className="flex items-center space-x-2 min-w-52">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="line-clamp-1">
              {department?.name || "Not assigned"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          suspended: "bg-yellow-100 text-yellow-800",
          pending: "bg-blue-100 text-blue-800",
          locked: "bg-red-100 text-red-800",
          deleted: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={`font-bold uppercase ${statusColors[status]}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("lastLoginAt")
            ? new Date(row.getValue("lastLoginAt")).toLocaleDateString()
            : "Never"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUser(user);
                setIsModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(user.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Users Management</CardTitle>
        <Button onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </CardHeader>

      <CardContent className="pl-2 h-full">
        <TableWrapper<User>
          columns={userColumns}
          data={users}
          loading={loading}
          title="Users List"
          showLocalSearch={true}
          showPagination={true}
        />
      </CardContent>

      <UsersForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        user={selectedUser}
        roles={roles}
        branches={branches}
        departments={departments}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </Card>
  );
};

export default UserTab;
