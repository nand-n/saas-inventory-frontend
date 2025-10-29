import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calculator, 
  CheckCircle, 
  XCircle, 
  Package,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Settings,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { Planning, PlanningStatus } from "@/types/planning.type";
import { StatusBadge } from "./status-badge";

interface PlanningDetailProps {
  planning: Planning;
  isLoading: boolean;
  onApprove: (status: PlanningStatus) => void;
  onReject: (status: PlanningStatus) => void;
  onRequest: () => void;
}

export function PlanningDetail({
  planning,
  isLoading,
  onApprove,
  onReject,
  onRequest,
}: PlanningDetailProps) {
  const [approvalData, setApprovalData] = useState({
    approvedBy: "",
    approvalRemarks: "",
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </Card>
      </div>
    );
  }

  if (!planning) return <div>Planning not found</div>;

  const isDraft = planning.status === PlanningStatus.DRAFT;
  const isRequested = planning.status === PlanningStatus.REQUESTED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{planning.name}</h1>
            <StatusBadge status={planning.status} />
          </div>
          <p className="text-muted-foreground">
            Created {format(new Date(planning.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Supply Inputs */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Supply Inputs</h2>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Demand</p>
                <p className="text-lg font-semibold">{planning.forecastMonthlyDemand?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forecast Horizon</p>
                <p className="text-lg font-semibold">{planning.forecastHorizonMonths} months</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-lg font-semibold">{planning.currentOnHand?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lead Time</p>
                <p className="text-lg font-semibold">{planning.leadTimeWeeks} weeks</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service Level</p>
                <p className="text-lg font-semibold">{planning.desiredServiceLevel}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Safety Factor</p>
                <p className="text-lg font-semibold">{planning.safetyFactor}</p>
              </div>
            </div>

            {(planning.moq || planning.packagingMultiple) && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Supplier Constraints</p>
                <div className="grid grid-cols-2 gap-4">
                  {planning.moq && (
                    <div>
                      <p className="text-sm text-muted-foreground">MOQ</p>
                      <p className="text-lg font-semibold">{planning.moq.toLocaleString()}</p>
                    </div>
                  )}
                  {planning.packagingMultiple && (
                    <div>
                      <p className="text-sm text-muted-foreground">Packaging Multiple</p>
                      <p className="text-lg font-semibold">{planning.packagingMultiple.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Calculated Results */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="text-xl font-semibold">Calculated Results</h2>
          </div>

          {planning.totalDemand ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Demand</p>
                  <p className="text-lg font-semibold">{planning.totalDemand?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Demand</p>
                  <p className="text-lg font-semibold">{planning.weeklyDemand?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Safety Stock</p>
                  <p className="text-lg font-semibold text-warning">{planning.safetyStock?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Raw Order Qty</p>
                  <p className="text-lg font-semibold">{planning.rawOrderQuantity?.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Decided Order Quantity</p>
                  <p className="text-3xl font-bold text-primary">{planning.decidedOrderQuantity?.toLocaleString()}</p>
                </div>
              </div>

              {planning.plannedShipmentBatches && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Shipment Batches</p>
                    <p className="text-lg font-semibold">{planning.plannedShipmentBatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Per Batch</p>
                    <p className="text-lg font-semibold">{planning.perBatchQuantity?.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Calculations will appear after requesting approval</p>
            </div>
          )}
        </Card>
      </div>

      {/* Resources */}
      {planning.resources && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Resources</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Manpower</p>
              <p className="font-medium">{planning.resources.manpower}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">{planning.resources.budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equipment</p>
              <p className="font-medium">{planning.resources.equipment?.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="font-medium">{planning.resources.departmentsInvolved?.join(", ")}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      {planning.timeline && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Timeline</h2>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{planning.timeline.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{planning.timeline.endDate}</p>
              </div>
            </div>
            {planning.timeline.milestones?.map((m, i) => (
              <div key={i} className="mt-2 p-2 border rounded-md">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.targetDate} - {m.status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Capacity */}
      {planning.capacity && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Capacity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Production Lines</p>
              <p className="font-medium">{planning.capacity.productionLines}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Output / Day</p>
              <p className="font-medium">{planning.capacity.maxOutputPerDay?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Utilization</p>
              <p className="font-medium">{planning.capacity.currentUtilization}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bottlenecks</p>
              <p className="font-medium">{planning.capacity.bottlenecks?.join(", ")}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Approval Sections */}
      {isDraft && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Request Approval</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Run calculations and submit for approval
          </p>
          <Button onClick={onRequest}>
            <Calculator className="mr-2 h-4 w-4" />
            Request Approval
          </Button>
        </Card>
      )}

      {isRequested && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-warning" />
            <h2 className="text-xl font-semibold">Approve or Reject</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Requested by</p>
              <p className="font-medium">{planning.approvalRequestedBy}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(planning.approvalRequestedAt!), "MMM d, yyyy h:mm a")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={approvalData.approvalRemarks}
                onChange={(e) =>
                  setApprovalData((prev) => ({ ...prev, approvalRemarks: e.target.value }))
                }
                placeholder="Add any comments..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onApprove(PlanningStatus.APPROVED)}
                className="bg-green-500 hover:bg-green-400 text-white" 
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(PlanningStatus.REJECTED)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </Card>
      )}

      {(planning.status === PlanningStatus.APPROVED ||
        planning.status === PlanningStatus.REJECTED) && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Approval Information</h2>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Approved/Rejected By</p>
                <p className="font-medium">{planning.approvedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(new Date(planning.approvedAt!), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
            {planning.approvalRemarks && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                <p className="font-medium">{planning.approvalRemarks}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
