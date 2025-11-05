import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, X, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { Rfi, RfiStatus } from "@/types/rfi.types";
import { format } from "date-fns";

interface RfiCardProps {
  rfi: Rfi;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onClose: (id: string) => void;
  onClick:() => void
}

export default function RfiCard({
  rfi,
  onEdit,
  onDelete,
  onPublish,
  onClose,
  onClick
}: RfiCardProps) {
  const getStatusBadge = () => {
    switch (rfi.status) {
      case RfiStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case RfiStatus.PUBLISHED:
        return <Badge className="bg-accent">Published</Badge>;
      case RfiStatus.CLOSED:
        return <Badge className="bg-success text-success-foreground">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card onClick={onClick} className="shadow-card cursor-pointer hover:shadow-hover transition-smooth group">
      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-3">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg group-hover:text-primary transition-smooth">
            {rfi.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {rfi.referenceNumber}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent  className="space-y-4">
        <div className="space-y-2 text-sm">
          {rfi.issueDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Issue: {format(new Date(rfi.issueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
          {rfi.submissionDeadline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {format(new Date(rfi.submissionDeadline), 'MMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{rfi.questions?.length || 0} Questions</span>
          </div>
        </div>

        {rfi.status === RfiStatus.PUBLISHED && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
            <p className="text-sm text-accent-foreground">
              Supplier submissions available in system.
            </p>
          </div>
        )}

        {rfi.status === RfiStatus.CLOSED && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-md">
            <p className="text-sm text-success font-medium">
              RFI Closed → Procurement evaluation & shortlisting can proceed.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {rfi.status === RfiStatus.DRAFT && (
            <Button size="sm" onClick={() => onPublish(rfi.id)}>
              Publish
            </Button>
          )}
          {rfi.status === RfiStatus.PUBLISHED && (
            <Button size="sm" variant="outline" onClick={() => onClose(rfi.id)}>
              Close RFI
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onEdit(rfi.id)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(rfi.id)}>
            <X className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
