"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  DepartmentFilters as Filters,
  Department,
} from "@/types/department.types";
import { Branch } from "@/types/branchTypes.type";
import { User } from "@/types/user.types";

interface DepartmentFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  branches: Branch[];
  users: User[];
  departments: Department[];
}

const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  branches =[],
  users =[],
  departments=[],
}) => {
  const handleFilterChange = (
    key: keyof Filters,
    value: string | boolean | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search departments..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="h-9"
        />

        <Selector
          value={filters.isActive?.toString() || ""}
          onValueChange={(value) =>
            handleFilterChange(
              "isActive",
              value === "true" ? true : value === "false" ? false : undefined
            )
          }
          options={[
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
          placeholder="Filter by status"
        />

        <Selector
          value={filters.branchId || ""}
          onValueChange={(value) => handleFilterChange("branchId", value)}
          options={[
            ...branches?.map((branch) => ({
              value: branch.id,
              label: branch.name,
            })),
          ]}
          placeholder="Filter by branch"
        />

        <Selector
          value={filters.managerId || ""}
          onValueChange={(value) => handleFilterChange("managerId", value)}
          options={[
            ...users.map((user) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })),
          ]}
          placeholder="Filter by manager"
        />
      </div>
    </div>
  );
};

export default DepartmentFilters;
