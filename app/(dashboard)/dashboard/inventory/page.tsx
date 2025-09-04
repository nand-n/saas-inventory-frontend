"use client";
import QRCode from "react-qr-code";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InventoryItemModal from "./_components/modals/inventory-item-modal";
import StockTransferModal from "./_components/modals/stock-transfer-modal";
import StockAdjustmentModal from "./_components/modals/stock-adjestment-modal";
import SummaryCards from "./_components/modals/summary-status";
import InventoryAnalytics from "./_components/inventory-analytics";
import QuickActions from "./_components/quick-actions";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const itemsPerPage = 20;
  const { toast } = useToast();
  const { tenantId: TenantId } = useUserStore();

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
    status: "Pending",
  });

  const [stockAdjustmentData, setStockAdjustmentData] = useState({
    branch_id: "",
    item_id: "",
    quantity: 0,
    reason: "",
    approved_by_id: "",
  });

  // API calls
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

  useEffect(() => {
    if (TenantId) {
      fetchBranchs();
    }
  }, [TenantId]);

  const refresh = useCallback(() => {
    fetchInventoryItems();
    fetchSummary();
  }, [fetchInventoryItems, fetchSummary]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/inventory/inventory-items/${id}`);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (selectedItem) {
        await axiosInstance.patch(
          `/inventory/inventory-items/${selectedItem.id}`,
          formData
        );
        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        await axiosInstance.post(`/inventory/inventory-items`, formData);
        toast({
          title: "Success",
          description: "Inventory item created successfully",
        });
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
      toast({
        title: "Error",
        description: "Failed to save inventory item",
        variant: "destructive",
      });
    }
  };

  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] =
    useState(false);
  const [isStockTransferModalOpen, setIsStockTransferModalOpen] =
    useState(false);

  const handleStockAdjustment = async (adjustmentData: any) => {
    try {
      await axiosInstance.post(`/inventory/stock-adjustments`, adjustmentData);
      toast({
        title: "Success",
        description: "Stock adjusted successfully",
      });
      setIsStockAdjustmentModalOpen(false);
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      });
    }
  };

  const handleStockTransfer = async (transferData: any) => {
    try {
      await axiosInstance.post(`/inventory/stock-transfers`, transferData);
      toast({
        title: "Success",
        description: "Stock transferred successfully",
      });
      setIsStockTransferModalOpen(false);
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive",
      });
    }
  };

  // Enhanced table columns with better formatting
  const inventoryItemColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div className="grid justify-start items-center">
          <QRCode
            value={row.getValue("sku")}
            size={60}
            className="border p-2 rounded-lg h-full"
          />
          <span className="font-bold text-xs text-center mt-1">
            {row.getValue("sku")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "item_name",
      header: "Item Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("item_name")}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = Number(row.getValue("quantity"));
        const reorderLevel = Number(row.original.reorder_level);
        const isLowStock = quantity <= reorderLevel;
        const isOutOfStock = quantity === 0;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {quantity}
            </span>
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            {isLowStock && !isOutOfStock && (
              <Badge variant="secondary">Low Stock</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "unit_price",
      header: "Unit Price",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(parseFloat(row.getValue("unit_price")))}
        </div>
      ),
    },
    {
      accessorKey: "unit_cost",
      header: "Unit Cost",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(parseFloat(row.getValue("unit_cost")))}
        </div>
      ),
    },
    {
      accessorKey: "reorder_level",
      header: "Reorder Level",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("reorder_level")}</div>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => {
        const category = inventoryCategories?.find(
          (c: { id: string; category_name: string }) =>
            c.id === row.getValue("category_id")
        );
        return (
          <Badge variant="outline" className="text-xs">
            {category?.category_name || "Unknown"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "branch_id",
      header: "Branch",
      cell: ({ row }) => {
        const branch = branches?.find(
          (b: { id: string; name: string }) =>
            b.id === row.getValue("branch_id")
        );
        return (
          <Badge variant="secondary" className="text-xs">
            {branch?.name || "Unknown"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>Edit Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Item</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>Adjust Stock</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>Transfer Stock</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const handleGenerateSKU = () => {
    const category = inventoryCategories?.find(
      (c: { id: string; category_name: string }) =>
        c.id === formData.category_id
    );
    const categoryAbbr =
      category?.category_name.slice(0, 3).toUpperCase() || "GEN";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, sku: `${categoryAbbr}-${randomNumber}` });
  };

  // Enhanced filtering logic
  const filteredItems = useMemo(() => {
    if (!inventoryItems) return [];

    return inventoryItems.filter((item: InventoryItem) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in-stock" &&
          Number(item.quantity) > Number(item.reorder_level)) ||
        (statusFilter === "low-stock" &&
          Number(item.quantity) <= Number(item.reorder_level) &&
          Number(item.quantity) > 0) ||
        (statusFilter === "out-of-stock" && Number(item.quantity) === 0);

      const matchesCategory =
        categoryFilter === "all" || item.category_id === categoryFilter;
      const matchesBranch =
        branchFilter === "all" || item.branch_id === branchFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesBranch;
    });
  }, [
    inventoryItems,
    searchTerm,
    statusFilter,
    categoryFilter,
    branchFilter,
    inventoryCategories,
    branches,
  ]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Calculate enhanced totals and analytics
  const {
    totalItems,
    totalQuantity,
    totalValue,
    lowStockItems,
    outOfStockItems,
    averagePrice,
  } = useMemo(() => {
    if (!summaryData)
      return {
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        averagePrice: 0,
      };

    const allItems = summaryData.reduce((acc: any[], branch: any) => {
      return acc.concat(branch.items || []);
    }, []);

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
      lowStockItems: allItems.filter(
        (item: any) =>
          Number(item.quantity) <= Number(item.reorder_level) &&
          Number(item.quantity) > 0
      ).length,
      outOfStockItems: allItems.filter(
        (item: any) => Number(item.quantity) === 0
      ).length,
      averagePrice:
        allItems.length > 0
          ? allItems.reduce(
              (acc: number, item: any) => acc + Number(item.unit_price),
              0
            ) / allItems.length
          : 0,
    };
  }, [summaryData]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your inventory items, track stock levels, and monitor
            performance
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Summary Cards */}
      <SummaryCards
        summaryLoading={summaryLoading}
        totalItems={totalItems}
        totalQuantity={totalQuantity}
        totalValue={totalValue}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
        averagePrice={averagePrice}
      />

      {/* Quick Actions */}
      <QuickActions
        onBulkExport={() => {
          toast({
            title: "Export",
            description: "Export functionality coming soon",
          });
        }}
        onBulkImport={() => {
          toast({
            title: "Import",
            description: "Import functionality coming soon",
          });
        }}
        onLowStockReport={() => {
          setStatusFilter("low-stock");
        }}
        onInventoryAudit={() => {
          toast({
            title: "Audit",
            description: "Inventory audit functionality coming soon",
          });
        }}
        onRefresh={refresh}
        lowStockCount={lowStockItems}
        outOfStockCount={outOfStockItems}
      />

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search items or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {inventoryCategories?.map(
                    (category: { id: string; category_name: string }) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.category_name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches?.map((branch: { id: string; name: string }) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Items per page</label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setCurrentPage(1)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branch Inventory Summary */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryData?.map((branch: any) => (
                <div
                  key={branch.branch_id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-lg mb-3">
                    {branch.branch_name}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{branch.total_items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">
                        {branch.total_quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">
                        {formatCurrency(Number(branch.total_value))}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>
                          {Math.round(
                            (branch.total_quantity /
                              (branch.total_items * 10)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={Math.round(
                          (branch.total_quantity / (branch.total_items * 10)) *
                            100
                        )}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Analytics */}
      <InventoryAnalytics
        summaryData={summaryData || []}
        isLoading={summaryLoading}
      />

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Items</CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {totalItems} items
          </div>
        </CardHeader>
        <CardContent>
          <TableWrapper<InventoryItem>
            columns={inventoryItemColumns}
            data={paginatedItems}
            loading={isLoading}
            title=""
            showPagination
          />
        </CardContent>
      </Card>

      {/* Modals */}
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
    </div>
  );
};

export default InventoryPage;
