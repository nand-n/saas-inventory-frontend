"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SalesOrderStatus, SoFilterOptions } from "@/types/sales-order.types";

interface Customer {
  id: string;
  name: string;
}

interface SalesOrderFiltersProps {
  filters: SoFilterOptions;
  onFiltersChange: (filters: SoFilterOptions) => void;
  customers: Customer[];
}

const SalesOrderFilters: React.FC<SalesOrderFiltersProps> = ({
  filters,
  onFiltersChange,
  customers,
}) => {
  const statuses = Object.values(SalesOrderStatus);

  const handleFilterChange = (key: keyof SoFilterOptions, value: string) => {
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
          Filter Sales Orders
        </h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <select
            id="status"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
              ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Filter */}
        <div className="space-y-2">
          <Label htmlFor="customerId" className="text-sm font-medium">
            Customer
          </Label>
          <select
            id="customerId"
            value={filters.customerId || ""}
            onChange={(e) => handleFilterChange("customerId", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
              ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Number Filter */}
        <div className="space-y-2">
          <Label htmlFor="orderNumber" className="text-sm font-medium">
            Order Number
          </Label>
          <Input
            id="orderNumber"
            type="text"
            placeholder="Search by order number"
            value={filters.orderNumber?.toString() || ""}
            onChange={(e) => handleFilterChange("orderNumber", e.target.value)}
          />
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium">
            Sort By
          </Label>
          <select
            id="sortBy"
            value={filters.sortBy || ""}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
              ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          >
            <option value="">Default</option>
            <option value="orderDate">Order Date</option>
            <option value="totalAmount">Total Amount</option>
            <option value="soNumber">Order Number</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderFilters;
