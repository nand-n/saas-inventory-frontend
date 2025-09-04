"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShipmentStatus,
  ShipmentType,
  Shipment,
  ShipmentFilterOptions,
} from "@/types/shipment.types";

interface ShipmentFiltersProps {
  filters: ShipmentFilterOptions;
  onFiltersChange: (filters: ShipmentFilterOptions) => void;
  carriers: string[];
}

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  filters,
  onFiltersChange,
  carriers,
}) => {
  const statuses = Object.values(ShipmentStatus);
  const types = Object.values(ShipmentType);

  const handleFilterChange = (
    key: keyof ShipmentFilterOptions,
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
          Filter Shipments
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
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Shipment Type
          </Label>
          <select
            id="type"
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Carrier Filter */}
        <div className="space-y-2">
          <Label htmlFor="carrier" className="text-sm font-medium">
            Carrier
          </Label>
          <select
            id="carrier"
            value={filters.carrier || ""}
            onChange={(e) => handleFilterChange("carrier", e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">All Carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>
        </div>

        {/* Tracking Number Filter */}
        <div className="space-y-2">
          <Label htmlFor="trackingNumber" className="text-sm font-medium">
            Tracking Number
          </Label>
          <Input
            id="trackingNumber"
            type="text"
            placeholder="Search by tracking number"
            value={filters.trackingNumber || ""}
            onChange={(e) =>
              handleFilterChange("trackingNumber", e.target.value)
            }
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
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-800"
          >
            <option value="">Default</option>
            <option value="shippedDate">Shipped Date</option>
            <option value="estimatedDeliveryDate">Estimated Delivery</option>
            <option value="actualDeliveryDate">Actual Delivery</option>
            <option value="shippingCost">Shipping Cost</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShipmentFilters;
