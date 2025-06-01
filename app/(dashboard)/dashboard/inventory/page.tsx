"use client";
import QRCode from "react-qr-code";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "@/types/inventory";
import useUserStore from "@/store/users/user.store";
import { Card } from "@/components/ui/card/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryItemModal from "./_components/modals/inventory-item-modal";
import StockTransferModal from "./_components/modals/stock-transfer-modal";
import StockAdjustmentModal from "./_components/modals/stock-adjestment-modal";
import useAuthStore from "@/store/auth/auth.store";
// import { useToast } from '@/components/ui/commons/toastProvider'

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;
  // const { showToast } = useToast()
  const data = useAuthStore();
  console.log(data, "data");
  const userRoles = useUserStore((state) => state.roles);
  const TenantId = "84e24130-6a56-4d55-8709-41774b1f4ef9";
  console.log(TenantId, "TenantId");
  const [formData, setFormData] = useState({
    item_name: "",
    sku: "",
    unit_price: 0,
    unit_cost: 0,
    reorder_level: 0,
    category_id: "",
    quantity: 0,
    branch_id: "",
    inventory_account_id: "",
  });

  const [stockTransferData, setStockTransferData] = useState({
    source_branch_id: "",
    destination_branch_id: "",
    item_id: "",
    quantity: 0,
    status: "Pending", // default status
  });

  const [stockAdjustmentData, setStockAdjustmentData] = useState({
    branch_id: "",
    item_id: "",
    quantity: 0,
    reason: "",
    approved_by_id: "",
  });

  const {
    data: inventoryItems,
    loading: isLoading,
    execute: fetchInventoryItems,
  } = useAsync(
    () =>
      axiosInstance.get(`/inventory/inventory-items/`).then((res) => res.data),
    true
  );
  const {
    data: branches,
    loading: isBranchsLoading,
    execute: fetchBranchs,
  } = useAsync(
    () => axiosInstance.get(`/branches/${TenantId}`).then((res) => res.data),
    false
  );

  useEffect(() => {
    if (TenantId) {
      fetchBranchs();
    }
  }, [TenantId]);
  const {
    data: summaryData,
    loading: summaryLoading,
    execute: fetchSummary,
  } = useAsync(
    () =>
      axiosInstance
        .get(`/inventory/inventory-items/summary/by-branch`)
        .then((res) => res.data),
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

  const {
    data: coas = [],
    loading: coaLoading,
    execute: fetchCoas,
  } = useAsync(
    () =>
      axiosInstance.get("/accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  const refresh = () => {
    fetchInventoryItems();
    fetchSummary();
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/inventory/inventory-items/${id}`);
      // showToast('default', 'Deleted!', 'Item deleted successfully')
      refresh();
    } catch (error) {
      // showToast('destructive', 'Error!', handleApiError(error))
    }
  };

  const handleSave = async () => {
    try {
      if (selectedItem) {
        await axiosInstance.patch(
          `/inventory/inventory-items/${selectedItem.id}`,
          formData
        );
        // showToast('default', 'Success!', 'Inventory item updated successfully')
      } else {
        await axiosInstance.post(`/inventory/inventory-items`, formData);
        // showToast('default', 'Success!', 'Inventory item created successfully')
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormData({
        item_name: "",
        sku: "",
        unit_price: 0,
        unit_cost: 0,
        branch_id: "",
        reorder_level: 0,
        category_id: "",
        quantity: 0,
        inventory_account_id: "",
      });
      refresh();
    } catch (error) {
      // showToast('destructive', 'Error!', handleApiError(error))
    }
  };

  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] =
    useState(false);
  const [isStockTransferModalOpen, setIsStockTransferModalOpen] =
    useState(false);
  const handleStockAdjustment = async (adjustmentData: any) => {
    try {
      await axiosInstance.post(`/inventory/stock-adjustments`, adjustmentData);
      // showToast('default', 'Success!', 'Stock adjusted successfully')
      setIsStockAdjustmentModalOpen(false);
      refresh();
    } catch (error) {
      // showToast('destructive', 'Error!', handleApiError(error))
    }
  };
  const handleStockTransfer = async (transferData: any) => {
    try {
      await axiosInstance.post(`/inventory/stock-transfers`, transferData);
      // showToast('default', 'Success!', 'Stock transferred successfully')
      setIsStockTransferModalOpen(false);
      refresh();
    } catch (error) {
      // showToast('destructive', 'Error!', handleApiError(error))
    }
  };

  const inventoryItemColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "item_name",
      header: "Item Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "unit_price",
      header: "Unit Price",
      cell: ({ row }) =>
        `$${parseFloat(row.getValue("unit_price")).toFixed(2)}`,
    },
    {
      accessorKey: "reorder_level",
      header: "Reorder Level",
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div className="flex justify-start items-center gap-2">
          <QRCode
            value={row.getValue("sku")}
            size={80}
            className="border p-2 rounded-lg h-full"
          />
          <span className="font-bold text-lg ">{row.getValue("sku")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedItem(item);
                setFormData({
                  item_name: item.item_name,
                  sku: item.sku,
                  unit_price: Number(item.unit_price),
                  unit_cost: Number(item.unit_cost),

                  reorder_level: Number(item.reorder_level),
                  category_id: item.category_id,
                  quantity: Number(item.quantity),
                  branch_id: item.branch_id,
                  inventory_account_id: "",
                });
                setIsModalOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedItem(item);
                setIsStockAdjustmentModalOpen(true);
              }}
            >
              🛠️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedItem(item);
                setIsStockTransferModalOpen(true);
              }}
            >
              🔁
            </Button>
          </div>
        );
      },
    },
  ];

  const handleGenerateSKU = () => {
    const category = inventoryCategories?.find(
      (c: { id: string }) => c.id === formData.category_id
    );
    const categoryAbbr =
      category?.category_name.slice(0, 3).toUpperCase() || "GEN";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, sku: `${categoryAbbr}-${randomNumber}` });
  };

  const filteredItems = useMemo(() => {
    if (!inventoryItems) return [];
    return inventoryItems.filter((item: InventoryItem) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Calculate totals
  const { totalItems, totalQuantity, totalValue } = useMemo(() => {
    if (!summaryData) return { totalItems: 0, totalQuantity: 0, totalValue: 0 };
    return {
      totalItems: summaryData.reduce(
        (acc: number, branch: { total_items: any }) =>
          acc + Number(branch.total_items),
        0
      ),
      totalQuantity: summaryData.reduce(
        (acc: number, branch: { total_quantity: any }) =>
          acc + Number(branch.total_quantity),
        0
      ),
      totalValue: summaryData.reduce(
        (acc: number, branch: { total_value: any }) =>
          acc + Number(branch.total_value),
        0
      ),
    };
  }, [summaryData]);

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 w-12 animate-pulse bg-gray-200 rounded" />
          ) : (
            <div className="text-2xl font-bold">{totalItems}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 w-12 animate-pulse bg-gray-200 rounded" />
          ) : (
            <div className="text-2xl font-bold">{totalQuantity}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-8 w-12 animate-pulse bg-gray-200 rounded" />
          ) : (
            <div className="text-2xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="gap-2"
            onClick={() => {
              setSelectedItem(null);
              setFormData({
                item_name: "",
                sku: "",
                branch_id: "",
                unit_price: 0,
                unit_cost: 0,
                reorder_level: 0,
                category_id: "",
                quantity: 0,
                inventory_account_id: "",
              });
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Add New Item
          </Button>
        </div>
      </div>
      <SummaryCards />

      {/* Add Branch Grouping Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Branch Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {summaryData?.map((branch: any) => (
                  <div
                    key={branch.branch_id}
                    className="flex flex-col gap-2 p-4 border rounded-lg"
                  >
                    <div className="font-medium">{branch.branch_name}</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Items: </span>
                        {branch.total_items}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Quantity:{" "}
                        </span>
                        {branch.total_quantity}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value: </span>$
                        {Number(branch.total_value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <TableWrapper<InventoryItem>
          columns={inventoryItemColumns}
          data={paginatedItems}
          loading={isLoading}
          title="Inventory Items"
        />
      </div>

      <InventoryItemModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        handleGenerateSKU={handleGenerateSKU}
        inventoryCategories={inventoryCategories}
        branches={branches}
        coas={coas}
      />

      <StockTransferModal
        isOpen={isStockTransferModalOpen}
        setIsOpen={setIsStockTransferModalOpen}
        stockTransferData={stockTransferData}
        setStockTransferData={setStockTransferData}
        handleStockTransfer={handleStockTransfer}
        setSelectedItem={setSelectedItem}
        branches={branches}
      />

      <StockAdjustmentModal
        isOpen={isStockAdjustmentModalOpen}
        setIsOpen={setIsStockAdjustmentModalOpen}
        stockAdjustmentData={stockAdjustmentData}
        setStockAdjustmentData={setStockAdjustmentData}
        handleStockAdjustment={handleStockAdjustment}
        setSelectedItem={setSelectedItem}
      />

      {!isLoading && filteredItems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
            {filteredItems.length} items
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
