"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateRiskRequest>({
    defaultValues: {
      title: "",
      description: "",
      severity: RiskSeverity.MEDIUM,
      likelihood: 0.5,
      impact: 0.5,
      mitigationPlan: "",
    },
  });

  // --- Handle editing existing risk
  useEffect(() => {
    if (risk) {
      reset({
        title: risk.title,
        description: risk.description ?? "",
        severity: risk.severity,
        likelihood: risk.likelihood,
        impact: risk.impact,
        branchId: risk.branchId ?? undefined,
        shipmentId: risk.shipmentId ?? undefined,
        mitigationPlan: risk.mitigationPlan ?? "",
      });
    } else {
      reset({
        title: "",
        description: "",
        severity: RiskSeverity.MEDIUM,
        likelihood: 0.5,
        impact: 0.5,
        mitigationPlan: "",
      });
    }
  }, [risk, reset]);

  const watchLikelihood = watch("likelihood");
  const watchImpact = watch("impact");
  const watchSeverity = watch("severity");

  const calculateRiskScore = () =>
    ((watchLikelihood ?? 0) * (watchImpact ?? 0) * 100).toFixed(1);

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

  // --- Prepare and clean payload before submitting
  const onFormSubmit = async (data: CreateRiskRequest) => {
    if (!data.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    // Clean up optional fields: remove them if empty
    const payload: CreateRiskRequest = { ...data };
    if (!payload.branchId?.trim()) delete payload.branchId;
    if (!payload.shipmentId?.trim()) delete payload.shipmentId;

    try {
      await onSubmit(payload);
      toast({
        title: "Success",
        description: risk
          ? "Risk updated successfully"
          : "Risk created successfully",
      });
      onClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save risk",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {risk ? "Edit Risk" : "Create New Risk"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter risk title"
                required
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <Selector
                value={watchSeverity as any}
                onValueChange={(value) =>
                  setValue("severity", value as RiskSeverity)
                }
                options={Object.values(RiskSeverity).map((severity) => ({
                  value: severity,
                  label:
                    severity.charAt(0).toUpperCase() + severity.slice(1),
                }))}
                placeholder="Select severity"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the risk in detail"
              rows={3}
            />
          </div>

          {/* Likelihood / Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="likelihood">Likelihood (0–1)</Label>
              <Input
                id="likelihood"
                type="number"
                step="0.1"
                min="0"
                max="1"
                {...register("likelihood", { valueAsNumber: true })}
              />
              <div className="text-sm text-gray-500">
                Probability of occurrence
              </div>
            </div>

            <div>
              <Label htmlFor="impact">Impact (0–1)</Label>
              <Input
                id="impact"
                type="number"
                step="0.1"
                min="0"
                max="1"
                {...register("impact", { valueAsNumber: true })}
              />
              <div className="text-sm text-gray-500">
                Severity of consequence
              </div>
            </div>
          </div>

          {/* Calculated Score */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Score:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
                  watchSeverity as any
                )}`}
              >
                {calculateRiskScore()}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Calculated as: Likelihood × Impact × 100
            </div>
          </div>

          {/* Branch / Shipment IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branchId">Branch ID (optional)</Label>
              <Input
                id="branchId"
                {...register("branchId")}
                placeholder="Enter branch ID if applicable"
              />
            </div>

            <div>
              <Label htmlFor="shipmentId">Shipment ID (optional)</Label>
              <Input
                id="shipmentId"
                {...register("shipmentId")}
                placeholder="Enter shipment ID if applicable"
              />
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
            <Textarea
              id="mitigationPlan"
              {...register("mitigationPlan")}
              placeholder="Describe mitigation steps"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isSubmitting}>
              {loading || isSubmitting
                ? "Saving..."
                : risk
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
