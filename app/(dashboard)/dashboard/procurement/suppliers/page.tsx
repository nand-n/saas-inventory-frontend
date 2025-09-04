"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import axiosInstance from "@/lib/axiosInstance";
import { exportToCSV } from "@/lib/utils";
import { UserRole } from "@/types/hr.types";
import { Supplier } from "@/types/supplier.types";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Filter, Pencil, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import SupplierDetails from "./_components/supplier-detail";
import SupplierForm from "./_components/supplier-form";
import SupplierFilters from "./_components/suppliers-filter";
import { useSupplierStore } from "@/store/suppliers/useSupplierStore";
import SupplierBulkActions from "./_components/suppliers-bulk-actinos";
import { useAsync } from "@/hooks/useAsync";
import { Badge } from "@/components/ui/badge";
import useTenantStore from "@/store/tenant/tenantStore";
import useUserStore from "@/store/users/user.store";

export default function SuppliersPage() {
  const {
    suppliers,
    filteredSuppliers,
    isLoading,
    filters,
    stats,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    bulkDeleteSuppliers,
    setFilters,
    clearFilters,
  } = useSupplierStore();

  const { id: tenantId } = useTenantStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const {
    data: products = [],
    loading: productsLoading,
    execute: fetchdProducts,
  } = useAsync(() => axiosInstance.get("products").then((r) => r.data), true);

  const {
    data: branchs = [],
    loading: branchsLoading,
    execute: fetchBranchs,
  } = useAsync(
    () => axiosInstance.get(`branches/${tenantId}`).then((r) => r.data),
    false
  );

  const {
    data: inventoryCategories,
    loading: inventoryCategoriesLoading,
    error: inventoryCategoriesError,
    execute,
  } = useAsync(
    () =>
      axiosInstance
        .get(`/inventory/inventory-categories/`)
        .then((res) => res.data),
    true
  );

  useEffect(() => {
    fetchSuppliers();
    if (tenantId) {
      fetchBranchs();
    }
  }, [fetchSuppliers, tenantId]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Supplier;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  products;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [page, setPage] = useState(1);

  const handleBulkDelete = () => {
    if (selectedSuppliers.length === 0) {
      toast.error("Please select suppliers to delete");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteSuppliers(selectedSuppliers);
    toast.success(
      `${selectedSuppliers.length} supplier(s) deleted successfully!`
    );
    setSelectedSuppliers([]);
    setIsDeleteModalOpen(false);
  };
  const sortedSuppliers = useMemo(() => {
    if (!sortConfig) return filteredSuppliers;

    return [...filteredSuppliers].sort((a, b) => {
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
  }, [filteredSuppliers, sortConfig]);

  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * 10;
    return filteredSuppliers.slice(start, start + 10);
  }, [filteredSuppliers, page]);
  const handleSelectAll = () => {
    if (selectedSuppliers.length === sortedSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(sortedSuppliers.map((emp) => emp.id));
    }
  };

  const handleSelectSupplier = (id: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/suppliers/${id}`);
    fetchSuppliers();
    toast.success("Supplier deleted");
  };

  const handleExport = () => {
    const exportData = suppliers?.map((s) => ({
      ID: s.id,
      Name: s.name,
      Code: s.code,
      Contact: s.contactPerson,
      Email: s.email,
      Phone: s.phone,
      Status: s.status,
      "Performance Rating": s.performanceRating,
      "Lead Time (Days)": s.leadTimeDays,
      "Payment Terms": s.paymentTerms,
    }));
    exportToCSV(
      exportData ?? [],
      `suppliers-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Suppliers exported successfully!");
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedSuppliers.length === sortedSuppliers.length &&
            sortedSuppliers.length > 0
          }
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <input
            type="checkbox"
            checked={selectedSuppliers.includes(supplier.id)}
            onChange={() => handleSelectSupplier(supplier.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        );
      },
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "contactPerson", header: "Contact" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="bg-green-600 uppercase">{row.original.status}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSupplier(s);
                setIsDetailsModalOpen(true);
              }}
            >
              <Eye />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSupplier(s);
                setIsEditModalOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(s.id)}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Supplier Management"
          subtitle="Manage your suppliers and related data"
        />

        <div className="flex flex-col sm:flex-row gap-3">
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
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.PROCUREMENT_MANAGER,
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
              UserRole.PROCUREMENT_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                </DialogHeader>
                <SupplierForm
                  products={products}
                  inventoryCategories={inventoryCategories}
                  branchs={branchs}
                  onSubmit={async (data) => {
                    addSupplier({
                      ...data,
                      address: {
                        street: data.street ?? "",
                        city: data.city ?? "",
                        state: data.state ?? "",
                        country: data.country ?? "",
                        zipCode: data.zipCode ?? "",
                      },
                    });
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-4">
          <SupplierFilters
            filters={filters}
            onFiltersChange={setFilters}
            suppliers={suppliers}
          />
        </div>
      )}
      {/* Bulk Actions */}
      {selectedSuppliers.length > 0 && (
        <SupplierBulkActions
          selectedCount={selectedSuppliers.length}
          onBulkDelete={handleBulkDelete}
          canDelete={selectedSuppliers.length > 0}
        />
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedSuppliers.length} supplier
            {selectedSuppliers.length !== 1 ? "s" : ""}?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TableWrapper<Supplier>
        columns={columns}
        data={paginatedSuppliers}
        loading={isLoading}
        title="Suppliers"
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <SupplierForm
            products={products}
            supplier={selectedSupplier}
            inventoryCategories={inventoryCategories}
            branchs={branchs}
            onSubmit={async (data) => {
              updateSupplier(selectedSupplier?.id ?? "", {
                ...data,
                address: {
                  street: data.street ?? "",
                  city: data.city ?? "",
                  state: data.state ?? "",
                  country: data.country ?? "",
                  zipCode: data.zipCode ?? "",
                },
              });
              setIsEditModalOpen(false);
              fetchSuppliers();
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>

          <SupplierDetails
            supplier={selectedSupplier}
            onClose={() => setIsDetailsModalOpen(false)}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              setIsEditModalOpen(true);
            }}
            canEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
