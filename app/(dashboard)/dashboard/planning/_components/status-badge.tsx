import { Badge } from "@/components/ui/badge";
import { PlanningStatus } from "@/types/planning.type";
import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";

interface StatusBadgeProps {
  status: PlanningStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    [PlanningStatus.DRAFT]: {
      label: "Draft",
      icon: FileText,
      className: "bg-status-draft text-foreground",
    },
    [PlanningStatus.REQUESTED]: {
      label: "Pending Approval",
      icon: Clock,
      className: "bg-warning text-warning-foreground",
    },
    [PlanningStatus.APPROVED]: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-success text-success-foreground",
    },
    [PlanningStatus.REJECTED]: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-destructive text-destructive-foreground",
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge className={className} variant="secondary">
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
