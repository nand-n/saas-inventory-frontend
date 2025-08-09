"use client";

import React from "react";
import { FilterOptions } from "@/types/common.type";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RfqFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function RfqFilters({
  filters,
  onFiltersChange,
}: RfqFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Search</Label>
        <Input
          placeholder="RFQ number or supplier..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={filters.status ?? ""}
          onValueChange={(val) =>
            onFiltersChange({ ...filters, status: val || undefined })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Label>Date From</Label>
          <Input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: e.target.value })
            }
          />
        </div>
        <div className="flex-1">
          <Label>Date To</Label>
          <Input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
