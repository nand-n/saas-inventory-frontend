"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { Plus, Trash, Pencil, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { exportToCSV, formatCurrency } from "@/lib/utils";
import { PurchaseOrder } from "@/types/po.types";
import { usePurchaseOrderStore } from "@/store/po/usePurchaseOrderStore";
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
import PurchaseOrderForm from "./_components/po-form";
import { useAsync } from "@/hooks/useAsync";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import PurchaseOrderDetails from "./_components/po-detail";
import PurchaseOrderBulkActions from "./_components/po-bulk-actions";
import PurchaseOrderFilters from "./_components/po-filter";

export default function PurchaseOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);

  const {
    data: products = [],
    loading: productsLoading,
    execute: fetchdProducts,
  } = useAsync(() => axiosInstance.get("products").then((r) => r.data), true);

  const {
    data: suppliers = [],
    loading: suppliersLoading,
    execute: fetchdSuppliers,
  } = useAsync(() => axiosInstance.get("suppliers").then((r) => r.data), true);

  const itemsPerPage = 10;

  const {
    purchaseOrders,
    filteredPurchaseOrders,
    isLoading,
    filters,
    fetchPurchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    bulkDeletePurchaseOrders,
    setFilters,
    clearFilters,
  } = usePurchaseOrderStore();

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const filtered = useMemo(() => {
    return filteredPurchaseOrders.filter(
      (po) =>
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredPurchaseOrders, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSelectAll = () => {
    if (selectedPOs.length === filtered.length) {
      setSelectedPOs([]);
    } else {
      setSelectedPOs(filtered.map((po) => po.id));
    }
  };

  const handleSelectPO = (id: string) => {
    setSelectedPOs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deletePurchaseOrder(id);
    toast.success("Purchase order deleted");
    fetchPurchaseOrders();
  };

  const confirmBulkDelete = async () => {
    await bulkDeletePurchaseOrders(selectedPOs);
    toast.success(
      `${selectedPOs.length} purchase order(s) deleted successfully!`
    );
    setSelectedPOs([]);
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const data = purchaseOrders.map((po) => ({
      ID: po.id,
      "PO Number": po.poNumber,
      Supplier: po.supplier.name,
      Status: po.status,
      Amount: po.totalAmount,
      "Order Date": po.orderDate,
    }));
    exportToCSV(
      data,
      `purchase-orders-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Purchase orders exported successfully!");
  };

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedPOs.length === filtered.length && filtered.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedPOs.includes(row.original.id)}
          onChange={() => handleSelectPO(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "poNumber",
      header: "PO Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <QRCode value={row.getValue("poNumber")} size={50} />
          <span>{row.getValue("poNumber")}</span>
        </div>
      ),
    },
    { accessorKey: "supplier.name", header: "Supplier" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="uppercase"> {row?.original?.status}</Badge>
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
              setSelectedPO(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPO(row.original);
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
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
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
                  <Plus className="h-4 w-4 mr-2" /> Add PO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Purchase Order</DialogTitle>
                </DialogHeader>
                <PurchaseOrderForm
                  onSubmit={async (data) => {
                    await addPurchaseOrder(data);
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                  suppliers={suppliers}
                  products={products}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-4">
          <PurchaseOrderFilters
            filters={filters}
            onFiltersChange={setFilters}
            suppliers={suppliers}
          />
        </div>
      )}

      {selectedPOs.length > 0 && (
        <PurchaseOrderBulkActions
          selectedCount={selectedPOs.length}
          onBulkDelete={() => setIsDeleteModalOpen(true)}
          canDelete={true}
          onBulkEmail={() => {}}
          onBulkExport={() => {}}
        />
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedPOs.length} purchase order
            {selectedPOs.length !== 1 ? "s" : ""}?
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

      <TableWrapper<PurchaseOrder>
        columns={columns}
        data={paginated}
        loading={isLoading}
        title="Purchase Orders"
      />

      {selectedPO && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Purchase Order</DialogTitle>
            </DialogHeader>
            <PurchaseOrderForm
              products={products}
              suppliers={suppliers}
              selectedPO={selectedPO}
              onSubmit={async (data) => {
                await updatePurchaseOrder(selectedPO?.id ?? "", data);
                setIsEditModalOpen(false);
                fetchPurchaseOrders();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      {selectedPO && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Purchase Order Details</DialogTitle>
            </DialogHeader>
            <PurchaseOrderDetails
              purchaseOrder={selectedPO}
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
