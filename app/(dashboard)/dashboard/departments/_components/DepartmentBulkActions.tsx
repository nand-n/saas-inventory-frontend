"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  User, 
  Trash2, 
  CheckCircle, 
  XCircle,
  MoreHorizontal 
} from "lucide-react";
import { DepartmentBulkAction } from "@/types/department.types";

interface DepartmentBulkActionsProps {
  selectedDepartments: string[];
  onBulkAction: (action: DepartmentBulkAction) => void;
  branches: Array<{ id: string; name: string }>;
  users: Array<{ id: string; firstName: string; lastName: string }>;
  departments: Array<{ id: string; name: string }>;
}

const DepartmentBulkActions: React.FC<DepartmentBulkActionsProps> = ({
  selectedDepartments,
  onBulkAction,
  branches,
  users,
  departments,
}) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [actionValue, setActionValue] = useState<string>("");

  const handleActionSubmit = () => {
    if (selectedAction && selectedDepartments.length > 0) {
      onBulkAction({
        departmentIds: selectedDepartments,
        action: selectedAction as any,
        value: actionValue || undefined,
      });
      setIsActionModalOpen(false);
      setSelectedAction("");
      setActionValue("");
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "activate":
        return "Activate";
      case "deactivate":
        return "Deactivate";
      case "delete":
        return "Delete";
      case "assignManager":
        return "Assign Manager";
      case "assignBranch":
        return "Assign Branch";
      default:
        return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "activate":
        return <CheckCircle className="w-4 h-4" />;
      case "deactivate":
        return <XCircle className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
      case "assignManager":
        return <User className="w-4 h-4" />;
      case "assignBranch":
        return <Building className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  const getActionOptions = (action: string) => {
    switch (action) {
      case "assignManager":
        return users.map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }));
      case "assignBranch":
        return branches.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));
      default:
        return [];
    }
  };

  if (selectedDepartments.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <Badge variant="secondary">
          {selectedDepartments.length} selected
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsActionModalOpen(true)}
        >
          Bulk Actions
        </Button>
      </div>

      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Action</label>
              <Selector
                value={selectedAction}
                onValueChange={setSelectedAction}
                options={[
                  { value: "activate", label: "Activate Departments" },
                  { value: "deactivate", label: "Deactivate Departments" },
                  { value: "delete", label: "Delete Departments" },
                  { value: "assignManager", label: "Assign Manager" },
                  { value: "assignBranch", label: "Assign Branch" },
                ]}
                placeholder="Select an action"
              />
            </div>

            {selectedAction && getActionOptions(selectedAction).length > 0 && (
              <div>
                <label className="text-sm font-medium">Value</label>
                <Selector
                  value={actionValue}
                  onValueChange={setActionValue}
                  options={getActionOptions(selectedAction)}
                  placeholder={`Select ${getActionLabel(selectedAction).toLowerCase()}`}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsActionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleActionSubmit}
                disabled={!selectedAction || (getActionOptions(selectedAction).length > 0 && !actionValue)}
              >
                {getActionIcon(selectedAction)}
                {getActionLabel(selectedAction)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentBulkActions;
