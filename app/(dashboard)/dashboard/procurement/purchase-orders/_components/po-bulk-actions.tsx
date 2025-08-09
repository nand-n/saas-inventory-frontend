"use client";

import React from "react";
import { Trash2, Download, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseOrderBulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onBulkEmail: () => void;
  canDelete: boolean;
}

const PurchaseOrderBulkActions: React.FC<PurchaseOrderBulkActionsProps> = ({
  selectedCount,
  onBulkDelete,
  onBulkExport,
  onBulkEmail,
  canDelete,
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {selectedCount} purchase order
              {selectedCount !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Choose an action to apply to selected orders
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkEmail}
            className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderBulkActions;
