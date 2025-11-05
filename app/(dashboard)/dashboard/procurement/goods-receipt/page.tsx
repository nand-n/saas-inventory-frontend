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
import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Filter, Pencil, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateGoodsReceiptDto, GoodsReceipt } from "@/types/grn.types";
import GrnForm from "./_components/grn-form";
import useTenantStore from "@/store/tenant/tenantStore";
import { useGrnStore } from "@/store/grn/useGrn.store";
import GRNForm from "./_components/grn-form";
import GoodsReceiptDetails from "./_components/grn-detail";
import { useAsync } from "@/hooks/useAsync";

export default function GrnPage() {
  const {
    grns,
    filteredGrns,
    isLoading,
    filters,
    fetchGrns,
    addGrn,
    updateGrn,
    deleteGrn,
    bulkDeleteGrns,
    setFilters,
    clearFilters,
  } = useGrnStore();

  const { id: tenantId } = useTenantStore();


    const {
    data: purchaseOrders = [],
    loading: poLoading,
    // execute: fetchdProducts,
  } = useAsync(() => axiosInstance.get("purchase-orders").then((r) => r.data), true);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedGrn, setSelectedGrn] = useState<GoodsReceipt | null>(null);
  const [selectedGrns, setSelectedGrns] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Fetch initial GRNs
  useEffect(() => {
    fetchGrns();
  }, []);

  // Sorting & Pagination
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GoodsReceipt;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedGrns = useMemo(() => {
    if (!sortConfig) return filteredGrns;
    return [...filteredGrns].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredGrns, sortConfig]);

  const paginatedGrns = useMemo(() => {
    const start = (page - 1) * 10;
    return sortedGrns.slice(start, start + 10);
  }, [sortedGrns, page]);

  const handleSelectAll = () => {
    if (selectedGrns.length === sortedGrns.length) setSelectedGrns([]);
    else setSelectedGrns(sortedGrns.map((g) => g.id));
  };

  const handleSelectGrn = (id: string) => {
    setSelectedGrns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteGrn(id);
    toast.success("GRN deleted successfully!");
  };

  const handleBulkDelete = () => {
    if (selectedGrns.length === 0) {
      toast.error("Please select GRNs to delete");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteGrns(selectedGrns);
    toast.success(`${selectedGrns.length} GRN(s) deleted`);
    setSelectedGrns([]);
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const exportData = grns.map((g) => ({
      ID: g.id,
      GRNNumber: g.grnNumber,
      Status: g.status,
      ReceivedDate: g.receivedDate,
      PurchaseOrder: g.purchaseOrder?.poNumber ?? "—",
      Warehouse: g.warehouse,
      ReceivedBy: g.receivedBy,
    }));
    exportToCSV(exportData, `grns-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("GRNs exported successfully!");
  };

  const columns: ColumnDef<GoodsReceipt>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={selectedGrns.length === sortedGrns.length && sortedGrns.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      cell: ({ row }) => {
        const g = row.original;
        return (
          <input
            type="checkbox"
            checked={selectedGrns.includes(g.id)}
            onChange={() => handleSelectGrn(g.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        );
      },
    },
    { accessorKey: "grnNumber", header: "GRN Number" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "receivedDate", header: "Received Date" },
    { accessorKey: "warehouse", header: "Warehouse" },
    { accessorKey: "receivedBy", header: "Received By" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const g = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedGrn(g);
                setIsDetailsModalOpen(true);
              }}
            >
              <Eye />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedGrn(g);
                setIsEditModalOpen(true);
              }}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(g.id)}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader title="Goods Receipts" subtitle="Manage all GRNs" />

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
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>

          <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.PROCUREMENT_MANAGER, UserRole.SUPER_ADMIN , UserRole.ALL]}>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </RoleGuard>

          <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.PROCUREMENT_MANAGER, UserRole.SUPER_ADMIN , UserRole.ALL]}>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add GRN
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New GRN</DialogTitle>
                </DialogHeader>
                <GRNForm
                purchaseOrders={purchaseOrders}
                  onSubmit={async (data) => {

      const grnNumber = `GRN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const payload: CreateGoodsReceiptDto = {
      grnNumber,
      purchaseOrderId: data.purchaseOrderId,
      receivedDate: data.receivedDate,
      receivedBy: data.receivedBy,
      warehouse: data.warehouse,
      items: data.items.map((item) => ({
        name: item.name,
        receivedQuantity: item.receivedQuantity,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
      })),
    };
                    addGrn(payload);
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {/* {isFiltersOpen && (
        <GrnFilters filters={filters} onFiltersChange={setFilters} grns={grns} />
      )}

      {selectedGrns.length > 0 && (
        <GrnBulkActions
          selectedCount={selectedGrns.length}
          onBulkDelete={handleBulkDelete}
        />
      )} */}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedGrns.length} GRN
            {selectedGrns.length !== 1 ? "s" : ""}?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmBulkDelete}>Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TableWrapper<GoodsReceipt>
        columns={columns}
        data={paginatedGrns}
        loading={isLoading}
        title="Goods Receipts"
      />

      {/* Edit Modal */}
      {/* <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit GRN</DialogTitle>
          </DialogHeader>
          <GRNForm
            grn={selectedGrn}
            onSubmit={async (data) => {
              updateGrn(selectedGrn?.id ?? "", data);
              setIsEditModalOpen(false);
              fetchGrns();
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog> */}

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>GRN Details</DialogTitle>
          </DialogHeader>
          <GoodsReceiptDetails
            grn={selectedGrn}
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
