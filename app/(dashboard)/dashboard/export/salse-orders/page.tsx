"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { Plus, Trash, Pencil, Filter, Download, Eye } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { exportToCSV, formatCurrency } from "@/lib/utils";
import { SalesOrder } from "@/types/sales-order.types";
import { useSalesOrderStore } from "@/store/so/useSalesOrderStore";
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
import SalesOrderForm from "./_components/so-form";
import SalesOrderFilters from "./_components/sales-order-filter";
import { FilterOptions } from "@/types/common.type";
import BulkActions from "@/components/commons/BulkActions";
import SalesOrderDetails from "./_components/salse-order-detaile";

export default function SalesOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSO, setSelectedSO] = useState<SalesOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedSOs, setSelectedSOs] = useState<string[]>([]);

  const { data: products = [] } = useAsync(
    () => axiosInstance.get("products").then((r) => r.data),
    true
  );

  const { data: customers = [] } = useAsync(
    () => axiosInstance.get("customers").then((r) => r.data),
    true
  );

  const itemsPerPage = 10;

  const {
    salesOrders,
    filteredSalesOrders,
    isLoading,
    filters,
    fetchSalesOrders,
    addSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    bulkDeleteSalesOrders,
    setFilters,
    clearFilters,
  } = useSalesOrderStore();

  useEffect(() => {
    fetchSalesOrders();
  }, [fetchSalesOrders]);

  const filtered = useMemo(() => {
    return filteredSalesOrders.filter(
      (so) =>
        so.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        so.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredSalesOrders, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSelectAll = () => {
    if (selectedSOs.length === filtered.length) {
      setSelectedSOs([]);
    } else {
      setSelectedSOs(filtered.map((so) => so.id));
    }
  };

  const handleSelectSO = (id: string) => {
    setSelectedSOs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteSalesOrder(id);
    fetchSalesOrders();
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteSalesOrders(selectedSOs);
    setSelectedSOs([]);
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const data = salesOrders.map((so) => ({
      ID: so.id,
      "SO Number": so.soNumber,
      Customer: so.customer.name,
      Status: so.status,
      Amount: so.totalAmount,
      "Order Date": so.orderDate,
    }));
    exportToCSV(
      data,
      `sales-orders-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const columns: ColumnDef<SalesOrder>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedSOs.length === filtered.length && filtered.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedSOs.includes(row.original.id)}
          onChange={() => handleSelectSO(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "soNumber",
      header: "SO Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <QRCode value={row.getValue("soNumber")} size={50} />
          <span>{row.getValue("soNumber")}</span>
        </div>
      ),
    },
    { accessorKey: "customer.name", header: "Customer" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="uppercase">{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) =>
        formatCurrency(parseFloat(row.getValue("totalAmount"))),
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => (
        <span>{dayjs(row.original.orderDate).format("YYYY-MM-DD")}</span>
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
              setSelectedSO(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSO(row.original);
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
        <h1 className="text-2xl font-bold">Sales Orders</h1>
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
                  <Plus className="h-4 w-4 mr-2" /> Add SO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Sales Order</DialogTitle>
                </DialogHeader>
                <SalesOrderForm
                  customers={customers}
                  products={products}
                  onSubmit={async (data) => {
                    await addSalesOrder(data);
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
          <SalesOrderFilters
            filters={filters}
            onFiltersChange={setFilters}
            customers={customers}
          />
        </div>
      )}

      {selectedSOs.length > 0 && (
        <BulkActions
          selectedCount={selectedSOs.length}
          onBulkDelete={() => setIsDeleteModalOpen(true)}
          canDelete={true}
          onExport={handleExport}
        />
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedSOs.length} sales order
            {selectedSOs.length !== 1 ? "s" : ""}?
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

      <TableWrapper<SalesOrder>
        columns={columns}
        data={paginated}
        loading={isLoading}
        title="Sales Orders"
      />

      {selectedSO && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Sales Order</DialogTitle>
            </DialogHeader>
            <SalesOrderForm
              customers={customers}
              products={products}
              selectedSO={selectedSO}
              onSubmit={async (data) => {
                await updateSalesOrder(selectedSO?.id ?? "", data);
                setIsEditModalOpen(false);
                fetchSalesOrders();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      {selectedSO && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Sales Order Details</DialogTitle>
            </DialogHeader>
            <SalesOrderDetails
              salesOrder={selectedSO}
              onClose={() => setIsDetailsModalOpen(false)}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                setIsEditModalOpen(true);
              }}
              canEdit={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
