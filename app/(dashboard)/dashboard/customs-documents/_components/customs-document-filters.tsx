"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Selector } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import {
  CustomsDocumentType,
  CustomsDocumentStatus,
  CustomsDocumentFilterOptions,
} from "@/types/shipment.types";

interface CustomsDocumentFiltersProps {
  filters: CustomsDocumentFilterOptions;
  onFiltersChange: (filters: CustomsDocumentFilterOptions) => void;
  onApplyFilters: () => void;
}

const CustomsDocumentFilters: React.FC<CustomsDocumentFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
}) => {
  const documentTypes = Object.values(CustomsDocumentType);
  const documentStatuses = Object.values(CustomsDocumentStatus);

  const handleFilterChange = (
    key: keyof CustomsDocumentFilterOptions,
    value: any
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getTypeLabel = (type: CustomsDocumentType) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusLabel = (status: CustomsDocumentStatus) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Customs Documents
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button size="sm" onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search documents..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Document Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Document Type
          </Label>

          <Selector
            value={filters.type || ""}
            onValueChange={(value) => handleFilterChange("type", value)}
            options={documentTypes.map((type) => ({
              value: type,
              label: getTypeLabel(type),
            }))}
            placeholder="All Types"
            emptyMessage="No types available"
            emptyIcon={<Filter className="h-4 w-4" />}
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Selector
            value={filters.status || ""}
            onValueChange={(value) => handleFilterChange("status", value)}
            options={documentStatuses.map((status) => ({
              value: status,
              label: getStatusLabel(status),
            }))}
            placeholder="All Statuses"
            emptyMessage="No statuses available"
            emptyIcon={<Filter className="h-4 w-4" />}
          />
        </div>

        {/* Requires Approval Filter */}
        <div className="space-y-2">
          <Label htmlFor="requiresApproval" className="text-sm font-medium">
            Requires Approval
          </Label>

          <Selector
            value={filters.requiresApproval?.toString() || ""}
            onValueChange={(value) =>
              handleFilterChange("requiresApproval", value === "true")
            }
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            placeholder="All"
            emptyMessage="No requires approval available"
            emptyIcon={<Filter className="h-4 w-4" />}
          />
        </div>

        {/* Issuing Authority Filter */}
        <div className="space-y-2">
          <Label htmlFor="issuingAuthority" className="text-sm font-medium">
            Issuing Authority
          </Label>
          <Input
            id="issuingAuthority"
            type="text"
            placeholder="Filter by authority..."
            value={filters.issuingAuthority || ""}
            onChange={(e) =>
              handleFilterChange("issuingAuthority", e.target.value)
            }
          />
        </div>

        {/* Issuing Country Filter */}
        <div className="space-y-2">
          <Label htmlFor="issuingCountry" className="text-sm font-medium">
            Issuing Country
          </Label>
          <Input
            id="issuingCountry"
            type="text"
            placeholder="Filter by country..."
            value={filters.issuingCountry || ""}
            onChange={(e) =>
              handleFilterChange("issuingCountry", e.target.value)
            }
          />
        </div>

        {/* Date From Filter */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium">
            From Date
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>

        {/* Date To Filter */}
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium">
            To Date
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>

      {/* Sorting Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Sort By Filter */}
        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium">
            Sort By
          </Label>
          <Selector
            value={filters.sortBy || "createdAt"}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
            options={[
              { value: "documentNumber", label: "Document Number" },
              { value: "issuedDate", label: "Issued Date" },
              { value: "expiryDate", label: "Expiry Date" },
              { value: "issuingAuthority", label: "Issuing Authority" },
              { value: "status", label: "Status" },
              { value: "createdAt", label: "Created Date" },
              { value: "updatedAt", label: "Updated Date" },
            ]}
            placeholder="Select order"
            emptyMessage="No order available"
            emptyIcon={<Filter className="h-4 w-4" />}
          />
        </div>

        {/* Sort Order Filter */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder" className="text-sm font-medium">
            Sort Order
          </Label>
          <Selector
            value={filters.sortOrder || "asc"}
            onValueChange={(value) => handleFilterChange("sortOrder", value)}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
            placeholder="Select order"
            emptyMessage="No order available"
            emptyIcon={<Filter className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomsDocumentFilters;
