import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier, SupplierFilterOptions } from "@/types/supplier.types";
import React from "react";

interface SupplierFiltersProps {
  filters: SupplierFilterOptions;
  onFiltersChange: (filters: SupplierFilterOptions) => void;
  suppliers: Supplier[];
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  filters,
  onFiltersChange,
  suppliers,
}) => {
  const countries = [
    ...new Set(suppliers.map((s) => s.address?.country).filter(Boolean)),
  ].sort();

  const cities = [
    ...new Set(suppliers.map((s) => s.address?.city).filter(Boolean)),
  ].sort();

  const statuses = ["active", "inactive"];

  const handleFilterChange = (
    key: keyof SupplierFilterOptions,
    value: string
  ) => {
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
          Filter Suppliers
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
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400"
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
          <Label htmlFor="country" className="text-sm font-medium">
            Country
          </Label>
          <select
            id="country"
            value={filters.country || ""}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400"
          >
            <option value="">All Countries</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City
          </Label>
          <select
            id="city"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400"
          >
            <option value="">All Cities</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
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
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus-visible:ring-blue-400"
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="createdAt">Created At</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium">
            Created From
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
            Created To
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

export default SupplierFilters;
