"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { Plus, Trash, Pencil, Filter, Download, Eye } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { exportToCSV, formatCurrency } from "@/lib/utils";
import {
  CustomsDocument,
  Shipment,
  ShipmentFormData,
} from "@/types/shipment.types";
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
import ShipmentForm from "./_components/shipment-form";
import BulkActions from "@/components/commons/BulkActions";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import useTenantStore from "@/store/tenant/tenantStore";
import useUserStore from "@/store/users/user.store";
import ShipmentDetails from "./_components/shipment-detail";
import { SheetClose, SheetContent, SheetHeader, SheetProvider, SheetTitle } from "@/components/ui/sheet";
import CustomsDocumentForm, {
  CustomsDocumentFormData,
} from "./_components/customs-document-form";
import CustomsDocumentDetails from "./_components/customs-document-detail";

export default function ShipmentsPage() {
  const { id: tenantId } = useTenantStore();
  const { id: currentUserId } = useUserStore();
  console.log(currentUserId, "currentUserId");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);

  const [activeCustomDocumentShipmentId, setActiveCustomDocumentShipmentId] =
    useState<string | null>(null);

  const [selectedCustomsDocument, setSelectedCustomsDocument] =
    useState<CustomsDocument | null>(null);
  const {
    data: products = [],
    loading: productsLoading,
    execute: fetchdProducts,
  } = useAsync(() => axiosInstance.get("products").then((r) => r.data), false);

  const {
    data: branchs = [],
    loading: branchsLoading,
    execute: fetchBranchs,
  } = useAsync(
    () => axiosInstance.get(`branches/${tenantId}`).then((r) => r.data),
    false
  );

  const {
    data: suppliers = [],
    loading: suppliersLoading,
    execute: fetchSuppliers,
  } = useAsync(() => axiosInstance.get(`suppliers`).then((r) => r.data), false);

  const {
    data: salseOrders = [],
    loading: salseOrdersLoading,
    execute: fetchSalesOrders,
  } = useAsync(
    () => axiosInstance.get(`sales-orders`).then((r) => r.data),
    false
  );

    const {
    data: purchaseOrders = [],
    loading: purchaseOrdersLoading,
    execute: fetchPurchaseOrders,
  } = useAsync(
    () => axiosInstance.get(`purchase-orders`).then((r) => r.data),
    false
  );

     const {
    data: customers = [],
    loading: customersLoading,
    execute: fetchCustomers,
  } = useAsync(
    () => axiosInstance.get(`customers`).then((r) => r.data),
    false
  );

  
  useEffect(() => {
    if (tenantId) {
      fetchSuppliers();
      fetchBranchs();
      fetchdProducts();
      fetchSalesOrders();
      fetchPurchaseOrders()
      fetchCustomers()
    }
  }, [tenantId]);

  const itemsPerPage = 10;

  const {
    shipments,
    filteredShipments,
    isLoading,
    filters,
    fetchShipments,
    addShipment,
    addNewCustomsDocument,
    updateShipment,
    deleteShipment,
    bulkDeleteShipments,
    setFilters,
    clearFilters,
  } = useShipmentsStore();

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const filtered = useMemo(() => {
    return filteredShipments.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredShipments, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSelectAll = () => {
    if (selectedShipments.length === filtered.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(filtered.map((s) => s.id));
    }
  };

  const handleSelectShipment = (id: string) => {
    setSelectedShipments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteShipment(id);
    fetchShipments();
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteShipments(selectedShipments);
    setSelectedShipments([]);
    setIsDeleteModalOpen(false);
  };

  const handleCustomsDocumentStatusChange = () => {
    // Refresh shipments to get updated customs document statuses
    fetchShipments();
  };

  const handleExport = () => {
    const data = shipments.map((s) => ({
      ID: s.id,
      "Tracking Number": s.trackingNumber,
      Carrier: s.carrier,
      Status: s.status,
      Type: s.type,
      "Shipped Date": s.shippedDate,
      "Estimated Delivery": s.estimatedDeliveryDate,
      "Shipping Cost": s.shippingCost,
    }));
    exportToCSV(
      data,
      `shipments-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const columns: ColumnDef<Shipment>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={
            selectedShipments.length === filtered.length && filtered.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedShipments.includes(row.original.id)}
          onChange={() => handleSelectShipment(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "trackingNumber",
      header: "Tracking Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <QRCode value={row.getValue("trackingNumber")} size={50} />
          <span>{row.getValue("trackingNumber")}</span>
        </div>
      ),
    },
    { accessorKey: "carrier", header: "Carrier" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="uppercase">{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "shippingCost",
      header: "Shipping Cost",
      cell: ({ row }) =>
        row.original.shippingCost
          ? formatCurrency(row.original.shippingCost)
          : "N/A",
    },
    {
      accessorKey: "shippedDate",
      header: "Shipped Date",
      cell: ({ row }) =>
        row.original.shippedDate
          ? dayjs(row.original.shippedDate).format("YYYY-MM-DD")
          : "N/A",
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
              setSelectedShipment(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedShipment(row.original);
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

  const renderCustomsDocumentsTable = (shipment: Shipment) => {
    const columns: ColumnDef<CustomsDocument>[] = [
      { accessorKey: "documentNumber", header: "Document Number" },
      { accessorKey: "type", header: "Type" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className="uppercase">{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: "issuedDate",
        header: "Issued Date",
        cell: ({ row }) =>
          row.original.issuedDate
            ? new Date(row.original.issuedDate).toLocaleDateString()
            : "N/A",
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ row }) =>
          row.original.expiryDate
            ? new Date(row.original.expiryDate).toLocaleDateString()
            : "N/A",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCustomsDocument(row.original)}
            >
              <Eye />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ];

    return (
      <TableWrapper<CustomsDocument>
        columns={columns}
        data={shipment.customsDocuments || []}
        loading={false}
        title={`Customs Documents for ${shipment.trackingNumber}`}
        rightHeaderContent={
          <Button
            onClick={() => setActiveCustomDocumentShipmentId(shipment.id)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Customs Document
          </Button>
        }
      />
    );
  };

  const hanldeAddNewCustomsDocument = async (data: CustomsDocumentFormData) => {
    await addNewCustomsDocument(data);
    setActiveCustomDocumentShipmentId(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Shipments</h1>
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
                  <Plus className="h-4 w-4 mr-2" /> Add Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Shipment</DialogTitle>
                </DialogHeader>
                <ShipmentForm
                  products={products}
                  // suppliers={suppliers}
                  branches={branchs}
                  salesOrders={salseOrders}
                  purchaseOrders={purchaseOrders}
                  // customers={customers}
                  onSubmit={async (data) => {
                    await addShipment(data as any);
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
        <div className="mt-4">
          <ShipmentFilters carriers={} filters={filters} onFiltersChange={setFilters} />
        </div>
      )} */}

      {selectedShipments.length > 0 && (
        <BulkActions
          selectedCount={selectedShipments.length}
          onBulkDelete={() => setIsDeleteModalOpen(true)}
          canDelete={true}
          onExport={handleExport}
        />
      )}

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm Bulk Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedShipments.length} shipment
            {selectedShipments.length !== 1 ? "s" : ""}?
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

      <TableWrapper<Shipment>
        columns={columns}
        data={paginated}
        loading={isLoading}
        title="Shipments"
        rowSubComponent={(shipment: Shipment) => renderCustomsDocumentsTable(shipment)}
      />

      {selectedShipment && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Shipment</DialogTitle>
            </DialogHeader>
            <ShipmentForm
              salesOrders={salseOrders}
              purchaseOrders={purchaseOrders}
              // customers={customers}
              shipment={selectedShipment}
              branches={branchs}
              products={products}
              // suppliers={suppliers}
              onSubmit={async (data) => {
                await updateShipment(selectedShipment?.id ?? "", data as any);
                setIsEditModalOpen(false);
                fetchShipments();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedShipment && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Shipment Details</DialogTitle>
            </DialogHeader>
            <ShipmentDetails
              shipment={selectedShipment}
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

      {activeCustomDocumentShipmentId && (
        <SheetProvider
          open={!!activeCustomDocumentShipmentId}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) setActiveCustomDocumentShipmentId(null); // close sheet
          }}
        >
          <SheetContent side="right" size={"default"} className="">
            <SheetHeader>
              <SheetTitle>Customs Document</SheetTitle>
              <SheetClose />
            </SheetHeader>

            <div className="p-4 overflow-y-auto h-full">
              <CustomsDocumentForm
                shipmentId={activeCustomDocumentShipmentId}
                onCancel={() => setActiveCustomDocumentShipmentId(null)}
                onSubmit={hanldeAddNewCustomsDocument}
              />
            </div>
          </SheetContent>
        </SheetProvider>
      )}

      {selectedCustomsDocument && (
        <SheetProvider
          open={!!selectedCustomsDocument}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) setSelectedCustomsDocument(null); // close sheet
          }}
        >
          <SheetContent side="right" size={"default"} className="">
            <SheetHeader>
              <SheetTitle>Customs Document Detial</SheetTitle>
              <SheetClose />
            </SheetHeader>

            <div className="p-4 overflow-y-auto h-full">
              <CustomsDocumentDetails
                document={selectedCustomsDocument}
                onClose={() => setSelectedCustomsDocument(null)}
                currentUserId={currentUserId}
                onStatusChange={handleCustomsDocumentStatusChange}
              />
            </div>
          </SheetContent>
        </SheetProvider>
      )}
    </div>
  );
}
