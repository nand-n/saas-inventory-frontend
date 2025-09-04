"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Selector } from "@/components/ui/select";
import {
  Risk,
  RiskSeverity,
  RiskStatus,
  CreateRiskRequest,
  UpdateRiskRequest,
} from "@/types/risk.types";
import { useToast } from "@/hooks/use-toast";

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk?: Risk | null;
  onSubmit: (data: CreateRiskRequest | UpdateRiskRequest) => Promise<void>;
  loading?: boolean;
}

const RiskModal: React.FC<RiskModalProps> = ({
  isOpen,
  onClose,
  risk,
  onSubmit,
  loading = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateRiskRequest>({
    title: "",
    description: "",
    severity: RiskSeverity.MEDIUM,
    likelihood: 0.5,
    impact: 0.5,
    branchId: "",
    shipmentId: "",
    mitigationPlan: "",
  });

  const isEditing = !!risk;

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title,
        description: risk.description || "",
        severity: risk.severity,
        likelihood: risk.likelihood,
        impact: risk.impact,
        branchId: risk.branchId || "",
        shipmentId: risk.shipmentId || "",
        mitigationPlan: risk.mitigationPlan || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        severity: RiskSeverity.MEDIUM,
        likelihood: 0.5,
        impact: 0.5,
        branchId: "",
        shipmentId: "",
        mitigationPlan: "",
      });
    }
  }, [risk]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: isEditing
          ? "Risk updated successfully"
          : "Risk created successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save risk",
        variant: "destructive",
      });
    }
  };

  const calculateRiskScore = () => {
    return (formData.likelihood * formData.impact * 100).toFixed(1);
  };

  const getSeverityColor = (severity: RiskSeverity) => {
    switch (severity) {
      case RiskSeverity.LOW:
        return "text-green-600 bg-green-100";
      case RiskSeverity.MEDIUM:
        return "text-yellow-600 bg-yellow-100";
      case RiskSeverity.HIGH:
        return "text-orange-600 bg-orange-100";
      case RiskSeverity.CRITICAL:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Risk" : "Create New Risk"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter risk title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Selector
                value={formData.severity}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, severity: value as RiskSeverity })
                }
                options={Object.values(RiskSeverity).map((severity) => ({
                  value: severity,
                  label: severity.charAt(0).toUpperCase() + severity.slice(1),
                }))}
                placeholder="Select severity"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the risk in detail"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="likelihood">Likelihood (0-1)</Label>
              <Input
                id="likelihood"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.likelihood}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    likelihood: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.0 to 1.0"
              />
              <div className="text-sm text-gray-500">
                Probability of the risk occurring
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact (0-1)</Label>
              <Input
                id="impact"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.impact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impact: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.0 to 1.0"
              />
              <div className="text-sm text-gray-500">
                Severity of the risk impact
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Score:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
                  formData.severity
                )}`}
              >
                {calculateRiskScore()}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Calculated as: Likelihood × Impact × 100
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branchId">Branch ID</Label>
              <Input
                id="branchId"
                value={formData.branchId}
                onChange={(e) =>
                  setFormData({ ...formData, branchId: e.target.value })
                }
                placeholder="Enter branch ID (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentId">Shipment ID</Label>
              <Input
                id="shipmentId"
                value={formData.shipmentId}
                onChange={(e) =>
                  setFormData({ ...formData, shipmentId: e.target.value })
                }
                placeholder="Enter shipment ID (optional)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
            <Textarea
              id="mitigationPlan"
              value={formData.mitigationPlan}
              onChange={(e) =>
                setFormData({ ...formData, mitigationPlan: e.target.value })
              }
              placeholder="Describe how to mitigate this risk"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Risk"
                : "Create Risk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RiskModal;
