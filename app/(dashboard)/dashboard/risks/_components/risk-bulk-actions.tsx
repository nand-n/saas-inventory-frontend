"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/select";
import { TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Risk, RiskStatus } from "@/types/risk.types";
import { useToast } from "@/hooks/use-toast";

interface RiskBulkActionsProps {
  selectedRisks: Risk[];
  onBulkStatusUpdate: (status: RiskStatus) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onClearSelection: () => void;
  loading?: boolean;
}

const RiskBulkActions: React.FC<RiskBulkActionsProps> = ({
  selectedRisks,
  onBulkStatusUpdate,
  onBulkDelete,
  onClearSelection,
  loading = false,
}) => {
  const { toast } = useToast();
  const [statusUpdateLoading, setStatusUpdateLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleStatusUpdate = async (status: RiskStatus) => {
    if (selectedRisks.length === 0) return;

    setStatusUpdateLoading(true);
    try {
      await onBulkStatusUpdate(status);
      toast({
        title: "Success",
        description: `Updated ${
          selectedRisks.length
        } risk(s) status to ${status.replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update risk statuses",
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRisks.length === 0) return;

    setDeleteLoading(true);
    try {
      await onBulkDelete();
      toast({
        title: "Success",
        description: `Deleted ${selectedRisks.length} risk(s)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete risks",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (selectedRisks.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedRisks.length} risk(s) selected
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-700"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bulk Status Update */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-700">Update Status:</span>
            <Selector
              value=""
              onValueChange={(value: string) =>
                handleStatusUpdate(value as RiskStatus)
              }
              disabled={statusUpdateLoading}
              options={Object.values(RiskStatus).map((status) => ({
                value: status,
                label:
                  status.replace("_", " ").charAt(0).toUpperCase() +
                  status.replace("_", " ").slice(1),
              }))}
              placeholder="Select status"
            />
          </div>

          {/* Bulk Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={deleteLoading}
            className="flex items-center space-x-2"
          >
            <TrashIcon className="w-4 h-4" />
            {deleteLoading ? "Deleting..." : `Delete ${selectedRisks.length}`}
          </Button>
        </div>
      </div>

      {/* Selected Risks Summary */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex flex-wrap gap-2">
          {selectedRisks.slice(0, 5).map((risk) => (
            <span
              key={risk.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {risk.title.length > 30
                ? `${risk.title.substring(0, 30)}...`
                : risk.title}
            </span>
          ))}
          {selectedRisks.length > 5 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              +{selectedRisks.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskBulkActions;
