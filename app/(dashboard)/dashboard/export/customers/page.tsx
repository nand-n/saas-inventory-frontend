"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { Plus, Trash, Pencil, Filter, Download, Eye } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { exportToCSV } from "@/lib/utils";
import { Customer } from "@/types/customers.types";
import { useCustomersStore } from "@/store/customers/useCustomersStore";
import RoleGuard from "@/components/commons/RoleGuard";
import { UserRole } from "@/types/hr.types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAsync } from "@/hooks/useAsync";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import CustomerForm from "./_components/customer-form";
import CustomerDetails from "./_components/customer-detail";
import CustomerFilters from "./_components/customer-filter";
import CustomerBulkActions from "./_components/customer-bulk-actions";
import useTenantStore from "@/store/tenant/tenantStore";

export default function CustomersPage() {
  const { id: tenantId } = useTenantStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const { data: shipments = [] } = useAsync(
    () => axiosInstance.get("shipments").then((r) => r.data),
    true
  );

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
    true
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

  const itemsPerPage = 10;

  const {
    customers,
    filteredCustomers,
    isLoading,
    filters,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    bulkDeleteCustomers,
    setFilters,
    clearFilters,
  } = useCustomersStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = useMemo(() => {
    return filteredCustomers.filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        (c.name || "").toLowerCase().includes(term) ||
        (c.code || "").toLowerCase().includes(term) ||
        (c.contactPerson || "").toLowerCase().includes(term) ||
        (c.email || "").toLowerCase().includes(term)
      );
    });
  }, [filteredCustomers, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSelectAll = () => {
    if (selectedCustomers.length === filtered.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filtered.map((c) => c.id));
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    fetchCustomers();
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteCustomers(selectedCustomers);
    setSelectedCustomers([]);
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const data = customers.map((c) => ({
      ID: c.id,
      Code: c.code,
      Name: c.name,
      Contact: c.contactPerson || "",
      Email: c.email || "",
      Phone: c.phone || "",
      Status: c.status || "",
      "Added At": c.createdAt ? dayjs(c.createdAt).format("YYYY-MM-DD") : "",
    }));

    exportToCSV(
      data,
      `customers-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedCustomers.length === filtered.length && filtered.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(row.original.id)}
          onChange={() => handleSelectCustomer(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <QRCode value={row.getValue("code") || row.original.id} size={48} />
          <span>{row.getValue("code") || row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact",
      cell: ({ row }) => row.getValue("contactPerson") ?? "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="uppercase">{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span>
          {row.original.createdAt
            ? dayjs(row.original.createdAt).format("YYYY-MM-DD")
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCustomer(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCustomer(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ALL]}
          >
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </RoleGuard>

          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ALL]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Customer
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Customer</DialogTitle>
                </DialogHeader>

                <CustomerForm
                  products={products}
                  onSubmit={async (data) => {
                    await addCustomer(data as any);
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                  branchs={branchs}
                  inventoryCategories={inventoryCategories}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {/* Filters area (optional) */}
      {isFiltersOpen && (
        <div className="mt-4">
          <CustomerFilters
            customers={customers}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      )}

      {/* Bulk actions bar (optional) */}
      {selectedCustomers.length > 0 && (
        <CustomerBulkActions
          selectedCount={selectedCustomers.length}
          onBulkDelete={() => setIsDeleteModalOpen(true)}
          canDelete
        />
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedCustomers.length} customer
            {selectedCustomers.length !== 1 ? "s" : ""}?
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

      <TableWrapper<Customer>
        columns={columns}
        data={paginated}
        loading={isLoading}
        title="Customers"
      />

      {/* Edit modal */}
      {selectedCustomer && (
        <Dialog modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>

            <CustomerForm
              products={products}
              branchs={branchs}
              inventoryCategories={inventoryCategories}
              selectedCustomer={selectedCustomer}
              onSubmit={async (data) => {
                await updateCustomer(selectedCustomer.id, data as any);
                setIsEditModalOpen(false);
                fetchCustomers();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Details modal (read-only) */}
      {selectedCustomer && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <CustomerDetails
              canEdit
              customer={selectedCustomer}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                setIsEditModalOpen(true);
              }}
              onClose={() => setIsDetailsModalOpen(false)}
            />
            <DialogFooter>
              <Button onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
