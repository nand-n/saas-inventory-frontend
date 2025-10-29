"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RiskFilters, RiskSeverity, RiskStatus } from "@/types/risk.types";

interface RiskFiltersProps {
  filters: RiskFilters;
  onFiltersChange: (filters: RiskFilters) => void;
  onClearFilters: () => void;
}

const RiskFiltersComponent: React.FC<RiskFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  const handleFilterChange = (
    key: keyof RiskFilters,
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  return (
    <div className=" p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <Input
            placeholder="Search risks..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Severity Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Severity</label>
          <Selector
            value={typeof filters.severity === "string" ? filters.severity : ""}
            onValueChange={(value) =>
              handleFilterChange(
                "severity",
                value === "" ? undefined : (value as RiskSeverity)
              )
            }
            options={[
              ...Object.values(RiskSeverity).map((severity) => ({
                value: severity,
                label: severity.charAt(0).toUpperCase() + severity.slice(1),
              })),
            ]}
            placeholder="All severities"
          />
        </div>

        {/* Status Filter */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Selector
            value={filters.status || ""}
            onValueChange={(value) =>
              handleFilterChange(
                "status",
                value === "" ? undefined : (value as RiskStatus)
              )
            }
            options={[
              { value: "", label: "All statuses" },
              ...Object.values(RiskStatus).map((status) => ({
                value: status,
                label:
                  status.replace("_", " ").charAt(0).toUpperCase() +
                  status.replace("_", " ").slice(1),
              })),
            ]}
            placeholder="All statuses"
          />
        </div> */}

        {/* Branch Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Branch ID</label>
          <Input
            placeholder="Filter by branch..."
            value={filters.branchId || ""}
            onChange={(e) => handleFilterChange("branchId", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipment Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Shipment ID
          </label>
          <Input
            placeholder="Filter by shipment..."
            value={filters.shipmentId || ""}
            onChange={(e) => handleFilterChange("shipmentId", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date Range */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="flex space-x-2">
            <Input
              type="date"
              value={
                filters.dateFrom
                  ? new Date(filters.dateFrom).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  "dateFrom",
                  e.target.value
                    ? new Date(e.target.value).toISOString().split("T")[0]
                    : undefined
                )
              }
              className="flex-1"
            />
            <span className="text-gray-500 self-center">to</span>
            <Input
              type="date"
              value={
                filters.dateTo
                  ? new Date(filters.dateTo).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  "dateTo",
                  e.target.value
                    ? new Date(e.target.value).toISOString().split("T")[0]
                    : undefined
                )
              }
              className="flex-1"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RiskFiltersComponent;
