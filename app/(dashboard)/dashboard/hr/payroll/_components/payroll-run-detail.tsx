import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, CalendarDays, User, Wallet, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PayrollRun, PayrollRunStatus } from "@/types/payroll.types";
import RoleGuard from "@/components/commons/RoleGuard";
import { UserRole } from "@/types/hr.types";
;

interface PayrollRunViewProps {
  run: PayrollRun;
  onApprove?: (id: string, data: { status: PayrollRunStatus }) => void;

  onCancel?: (id: string) => void;
  onBack?: () => void;
}

export default function PayrollRunDetail({ run, onApprove, onCancel, onBack }: PayrollRunViewProps) {
  const [loadingAction, setLoadingAction] = React.useState<"approve" | "cancel" | null>(null);

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Loading payroll run details...</p>
      </div>
    );
  }

const handleStatusChange = async (nextStatus: PayrollRunStatus) => {
  if (!onApprove) return;
  setLoadingAction("approve");
  await onApprove(run.id, {status:nextStatus});
  setLoadingAction(null);
};

  const handleCancel = async () => {
    if (!onCancel) return;
    setLoadingAction("cancel");
    await onCancel(run.id);
    setLoadingAction(null);
  };

  // 🔖 Determine badge color by status
  const getStatusColor = (status: PayrollRunStatus) => {
    switch (status) {
      case PayrollRunStatus.DRAFT:
        return "bg-gray-200 text-gray-800";
      case PayrollRunStatus.PROCESSING:
        return "bg-blue-100 text-blue-700";
      case PayrollRunStatus.COMPLETED:
        return "bg-green-100 text-green-700";
      case PayrollRunStatus.APPROVED:
        return "bg-emerald-200 text-emerald-800";
      case PayrollRunStatus.CANCELLED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Payroll Run Details
          </CardTitle>
          <CardDescription>Review payroll run information, employees, and totals</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payroll Info */}
          <div>
            <h3 className="font-semibold mb-3">Payroll Run Info</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{run.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className={getStatusColor(run.status)}>{run.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Period Start</p>
                <p className="font-medium">{new Date(run.periodStart).toDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Period End</p>
                <p className="font-medium">{new Date(run.periodEnd).toDateString()}</p>
              </div>
              {run.payDate && (
                <div>
                  <p className="text-muted-foreground">Pay Date</p>
                  <p className="font-medium">{new Date(run.payDate).toDateString()}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div>
            <h3 className="font-semibold mb-3">Payroll Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Gross Pay:</span>
                <span className="font-semibold">{formatCurrency(run.totalGrossPay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Deductions:</span>
                <span className="font-semibold text-destructive">
                  -{formatCurrency(run.totalDeductions)}
                </span>
              </div>
              <div className="flex justify-between text-base border-t pt-2">
                <span className="font-semibold">Total Net Pay:</span>
                <span className="font-bold text-primary">{formatCurrency(run.totalNetPay)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Employees */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Employees ({run.payrolls?.length ?? 0})
            </h3>
            {run.payrolls && run.payrolls.length > 0 ? (
              <div className="border rounded-lg divide-y max-h-[280px] overflow-y-auto">
                {run.payrolls.map((p: any) => (
                  <div key={p.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {p.employee?.firstName} {p.employee?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.employee?.jobTitle}</p>
                    </div>
                    <Badge variant="secondary">{formatCurrency(p.netPay)}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payroll records yet</p>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          {/* {run.metadata && (
            <div>
              <h3 className="font-semibold mb-3">Metadata</h3>
              <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">
                {JSON.stringify(run.metadata, null, 2)}
              </pre>
            </div>
          )} */}

          {run.metadata && (
  <div>
    <h3 className="font-semibold mb-3">Change History</h3>

    {(() => {
      try {
        const metadata = typeof run.metadata === "string"
          ? JSON.parse(run.metadata)
          : run.metadata;

        const history = Array.isArray(metadata?.history) ? metadata.history : [];

        if (history.length === 0) {
          return (
            <p className="text-sm text-muted-foreground">
              No history available.
            </p>
          );
        }

        return (
          <div className="space-y-3">
            {history.map((entry: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-lg p-3 bg-muted/40 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm"
              >
                <div>
                  <p>
                    <span className="font-medium text-primary">
                      {entry.from?.toUpperCase() || "Unknown"}
                    </span>{" "}
                    →{" "}
                    <span className="font-medium text-green-600">
                      {entry.to?.toUpperCase() || "Unknown"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changed at{" "}
                    {entry.changedAt
                      ? new Date(entry.changedAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      } catch (err) {
        // fallback in case metadata is malformed
        return (
          <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto text-destructive">
            Invalid metadata format
          </pre>
        );
      }
    })()}
  </div>
)}

        </CardContent>
      </Card>

      {/* Footer Actions */}
      {/* <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER]}>
          <div className="flex gap-2">
            {run.status === PayrollRunStatus.COMPLETED && (
              <Button
                onClick={handleApprove}
                disabled={loadingAction === "approve"}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {loadingAction === "approve" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                  </>
                )}
              </Button>
            )}

            {run.status !== PayrollRunStatus.CANCELLED &&
              run.status !== PayrollRunStatus.APPROVED && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={loadingAction === "cancel"}
                >
                  {loadingAction === "cancel" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </>
                  )}
                </Button>
              )}
          </div>
        </RoleGuard>
      </div> */}
      {/* Footer Actions */}
<div className="flex justify-between items-center">
  <Button variant="outline" onClick={onBack}>
    Back
  </Button>

  <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}>
    <div className="flex gap-2">
      {/* Draft → Processing */}
      {run.status === PayrollRunStatus.DRAFT && (
        <>
          <Button
            onClick={() => handleStatusChange(PayrollRunStatus.PROCESSING)}
            disabled={loadingAction === "approve"}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loadingAction === "approve" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 mr-2" /> Start Processing
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loadingAction === "cancel"}
          >
            {loadingAction === "cancel" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" /> Cancel
              </>
            )}
          </Button>
        </>
      )}

      {/* Processing → Completed */}
      {run.status === PayrollRunStatus.PROCESSING && (
        <>
          <Button
            onClick={() => handleStatusChange(PayrollRunStatus.COMPLETED)}
            disabled={loadingAction === "approve"}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loadingAction === "approve" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loadingAction === "cancel"}
          >
            {loadingAction === "cancel" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" /> Cancel
              </>
            )}
          </Button>
        </>
      )}

      {/* Completed → Approved */}
      {run.status === PayrollRunStatus.COMPLETED && (
        <>
          <Button
            onClick={() => handleStatusChange(PayrollRunStatus.APPROVED)}
            disabled={loadingAction === "approve"}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loadingAction === "approve" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loadingAction === "cancel"}
          >
            {loadingAction === "cancel" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" /> Cancel
              </>
            )}
          </Button>
        </>
      )}

      {/* Approved: locked state */}
      {run.status === PayrollRunStatus.APPROVED && (
        <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
          <CheckCircle2 className="w-4 h-4 mr-1 inline" />
          Approved
        </Badge>
      )}

      {/* Cancelled: locked state */}
      {run.status === PayrollRunStatus.CANCELLED && (
        <Badge className="bg-red-100 text-red-700 px-3 py-1">
          <XCircle className="w-4 h-4 mr-1 inline" />
          Cancelled
        </Badge>
      )}
    </div>
  </RoleGuard>
</div>


    </div>
  );
}
