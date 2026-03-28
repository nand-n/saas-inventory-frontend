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
import { exportToCSV, formatCurrency } from "@/lib/utils";
import { RFQ } from "@/types/rfq.types";
import { useRfqStore } from "@/store/rfq/useRfqStore";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import RfqForm from "./_components/rfq-form";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import RfqFilters from "./_components/rfq-filter";
import RfqDetails from "./_components/rfq-detail";

export default function RfqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedRFQs, setSelectedRFQs] = useState<string[]>([]);

  const itemsPerPage = 10;

  const {
    rfqs,
    filteredRfqs,
    isLoading,
    filters,
    fetchRfqs,
    addRfq,
    updateRfq,
    deleteRfq,
    bulkDeleteRfqs,
    setFilters,
    clearFilters,
  } = useRfqStore();

  useEffect(() => {
    fetchRfqs();
  }, []);

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

  const filtered = useMemo(() => {
    return filteredRfqs.filter(
      (rfq) =>
        rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredRfqs, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSelectAll = () => {
    if (selectedRFQs.length === filtered.length) {
      setSelectedRFQs([]);
    } else {
      setSelectedRFQs(filtered.map((rfq) => rfq.id));
    }
  };

  const handleSelectRFQ = (id: string) => {
    setSelectedRFQs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteRfq(id);
    toast.success("RFQ deleted");
    fetchRfqs();
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteRfqs(selectedRFQs);
    toast.success(`${selectedRFQs.length} RFQ(s) deleted successfully!`);
    setSelectedRFQs([]);
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const data = rfqs.map((rfq) => ({
      ID: rfq.id,
      "RFQ Number": rfq.rfqNumber,
      Supplier: rfq.supplier?.name ?? "",
      Status: rfq.status,
      "Issued Date": dayjs(rfq.issuedDate).format("YYYY-MM-DD"),
      "Valid Until": dayjs(rfq.validUntil).format("YYYY-MM-DD"),
      Amount: rfq.totalAmount,
    }));
    exportToCSV(data, `rfqs-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("RFQs exported successfully!");
  };

  const columns: ColumnDef<RFQ>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedRFQs.length === filtered.length && filtered.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRFQs.includes(row.original.id)}
          onChange={() => handleSelectRFQ(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "rfqNumber",
      header: "RFQ Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <QRCode value={row.getValue("rfqNumber")} size={50} />
          <span>{row.getValue("rfqNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "supplier.name",
      header: "Supplier",
    },
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
      accessorKey: "issuedDate",
      header: "Issued Date",
      cell: ({ row }) => (
        <span>{dayjs(row.original.issuedDate).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
      cell: ({ row }) => (
        <span>{dayjs(row.original.validUntil).format("YYYY-MM-DD")}</span>
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
              setSelectedRFQ(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRFQ(row.original);
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
        <h1 className="text-2xl font-bold">Requests For Quotation (RFQs)</h1>
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add RFQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add RFQ</DialogTitle>
              </DialogHeader>
              <RfqForm
                products={products}
                suppliers={suppliers}
                onSubmit={async (data) => {
                  const d = {
                    ...data,
                    items: data.items.map((item) => ({
                      ...item,
                      productName:
                        products.find((p: any) => p.id === item.productId)
                          ?.name || "Unknown Product",
                    })),
                  };
                  await addRfq(d);
                  setIsAddModalOpen(false);
                }}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-4">
          <RfqFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      )}

      {/* {selectedRFQs.length > 0 && (
        <RfqBulkActions
          selectedCount={selectedRFQs.length}
          onBulkDelete={() => setIsDeleteModalOpen(true)}
        />
      )} */}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedRFQs.length} RFQ
            {selectedRFQs.length !== 1 ? "s" : ""}?
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

      <TableWrapper<RFQ>
        columns={columns}
        data={paginated}
        loading={isLoading}
        title="RFQs"
      />

      {selectedRFQ && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit RFQ</DialogTitle>
            </DialogHeader>
            <RfqForm
              selectedRFQ={selectedRFQ}
              onSubmit={async (data) => {
                const d = {
                  ...data,
                  items: data.items.map((item) => ({
                    ...item,
                    productName:
                      products.find((p: any) => p.id === item.productId)
                        ?.name || "Unknown Product",
                  })),
                };
                await updateRfq(selectedRFQ?.id ?? "", d);
                setIsEditModalOpen(false);
                fetchRfqs();
              }}
              products={products}
              suppliers={suppliers}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      {selectedRFQ && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>RFQ Details</DialogTitle>
            </DialogHeader>
            <RfqDetails
              rfq={selectedRFQ}
              onClose={() => setIsDetailsModalOpen(false)}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                setIsEditModalOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
