"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  canDelete?: boolean;
  onExport?: () => void;
}

export default function BulkActions({
  selectedCount,
  onBulkDelete,
  canDelete = false,
  onExport,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-muted p-3 rounded-md border">
      <span className="text-sm">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <div className="flex gap-2">
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            Export
          </Button>
        )}
        {canDelete && (
          <Button variant="destructive" size="sm" onClick={onBulkDelete}>
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  );
}


