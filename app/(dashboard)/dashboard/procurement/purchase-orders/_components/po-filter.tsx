"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PoFilterOptions } from "@/types/po.types";
import { Supplier } from "@/types/supplier.types";
import React from "react";

interface PurchaseOrderFiltersProps {
  filters: PoFilterOptions;
  onFiltersChange: (filters: PoFilterOptions) => void;
  suppliers: Supplier[];
}

const PurchaseOrderFilters: React.FC<PurchaseOrderFiltersProps> = ({
  filters,
  onFiltersChange,
  suppliers,
}) => {
  const statuses = ["issued", "completed", "cancelled"];

  const handleFilterChange = (key: keyof PoFilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Purchase Orders
        </h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <select
            id="status"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier" className="text-sm font-medium">
            Supplier
          </Label>
          <select
            id="supplier"
            value={filters.supplierId || ""}
            onChange={(e) => handleFilterChange("supplierId", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">All Suppliers</option>
            {suppliers?.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium">
            Sort By
          </Label>
          <select
            id="sortBy"
            value={filters.sortBy || ""}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">Default</option>
            <option value="orderDate">Order Date</option>
            <option value="expectedDeliveryDate">Delivery Date</option>
            <option value="totalAmount">Total Amount</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderNumber" className="text-sm font-medium">
            Order Number
          </Label>
          <Input
            id="orderNumber"
            type="text"
            placeholder="PO-XXX"
            value={filters.orderNumber || ""}
            onChange={(e) => handleFilterChange("orderNumber", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium">
            Order Date From
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium">
            Order Date To
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderFilters;
