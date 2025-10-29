import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PayrollRunStatus } from "@/types/payroll.types";
import { CheckCircle, XCircle, Loader, FileCheck } from "lucide-react";
import { useState } from "react";

export function ChangeRunStatusButton({
  runId,
  currentStatus,
  newStatus,
  onStatusChange,
}: {
  runId: string;
  currentStatus: PayrollRunStatus;
  newStatus: PayrollRunStatus;
  onStatusChange: (status: PayrollRunStatus) => void;
}) {
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    [PayrollRunStatus.DRAFT]: { color: "text-yellow-600", label: "Start Processing", icon: Loader },
    [PayrollRunStatus.PROCESSING]: { color: "text-yellow-600", label: "Start Processing", icon: Loader },
    [PayrollRunStatus.COMPLETED]: { color: "text-blue-600", label: "Mark as Completed", icon: FileCheck },
    [PayrollRunStatus.APPROVED]: { color: "text-green-600", label: "Approve", icon: CheckCircle },
    [PayrollRunStatus.CANCELLED]: { color: "text-red-600", label: "Cancel", icon: XCircle },
  }[newStatus];

  const Icon = statusConfig?.icon || CheckCircle;

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payrolls/run/${runId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      onStatusChange(newStatus);
    } catch (err) {
      console.error(err);
      alert("Error changing status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${statusConfig.color} hover:opacity-80 flex items-center gap-1`}
        >
          <Icon className="h-4 w-4" />
          {statusConfig.label}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Confirm ${statusConfig.label}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will change the payroll run status from{" "}
            <strong>{currentStatus}</strong> to{" "}
            <strong>{newStatus}</strong>. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleChangeStatus} disabled={loading}>
            {loading ? "Processing..." : "Yes, Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
