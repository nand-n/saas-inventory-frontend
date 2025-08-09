import React from "react";
import { Trash2, Download, Mail, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplierBulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  canDelete: boolean;
}

const SupplierBulkActions: React.FC<SupplierBulkActionsProps> = ({
  selectedCount,
  onBulkDelete,
  canDelete,
}) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedCount} supplier{selectedCount !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Choose an action to apply to selected suppliers
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
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

export default SupplierBulkActions;
