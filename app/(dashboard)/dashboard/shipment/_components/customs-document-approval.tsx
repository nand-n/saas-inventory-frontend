"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from "lucide-react";
import { CustomsDocument, CustomsDocumentStatus } from "@/types/shipment.types";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface CustomsDocumentApprovalProps {
  document: CustomsDocument;
  currentUserId: string;
  onStatusChange?: () => void;
}

export default function CustomsDocumentApproval({
  document,
  currentUserId,
  onStatusChange,
}: CustomsDocumentApprovalProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const {
  //   approveCustomsDocument,
  //   rejectCustomsDocument,
  //   reviewCustomsDocument,
  //   submitForApproval,
  // } = useShipmentsStore();
  const { toast } = useToast();

  const getStatusBadge = (status: CustomsDocumentStatus) => {
    switch (status) {
      case CustomsDocumentStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case CustomsDocumentStatus.PENDING_APPROVAL:
        return (
          <Badge variant="default" className="bg-yellow-500">
            Pending Approval
          </Badge>
        );
      case CustomsDocumentStatus.UNDER_REVIEW:
        return (
          <Badge variant="default" className="bg-blue-500">
            Under Review
          </Badge>
        );
      case CustomsDocumentStatus.APPROVED:
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        );
      case CustomsDocumentStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      case CustomsDocumentStatus.SUBMITTED:
        return (
          <Badge variant="default" className="bg-purple-500">
            Submitted
          </Badge>
        );
      case CustomsDocumentStatus.ACCEPTED:
        return (
          <Badge variant="default" className="bg-green-600">
            Accepted
          </Badge>
        );
      case CustomsDocumentStatus.EXPIRED:
        return <Badge variant="secondary">Expired</Badge>;
      case CustomsDocumentStatus.CANCELLED:
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canReview = document.status === CustomsDocumentStatus.PENDING_APPROVAL;
  const canApprove = document.status === CustomsDocumentStatus.UNDER_REVIEW;
  const canReject =
    document.status === CustomsDocumentStatus.PENDING_APPROVAL ||
    document.status === CustomsDocumentStatus.UNDER_REVIEW;
  const canSubmit = document.status === CustomsDocumentStatus.DRAFT;

  const handleReview = async () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please provide review notes before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // await reviewCustomsDocument(document.id!, currentUserId, reviewNotes);
      toast({
        title: "Document Reviewed",
        description: "Document has been marked for review.",
      });
      setIsReviewDialogOpen(false);
      setReviewNotes("");
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Review Failed",
        description: "Failed to review document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // await approveCustomsDocument(document.id!, currentUserId, reviewNotes);
      toast({
        title: "Document Approved",
        description: "Document has been approved successfully.",
      });
      setIsApproveDialogOpen(false);
      setReviewNotes("");
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // await rejectCustomsDocument(document.id!, currentUserId, rejectionReason);
      toast({
        title: "Document Rejected",
        description: "Document has been rejected.",
      });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true);
    try {
      // await submitForApproval(document.id!);
      toast({
        title: "Submitted for Approval",
        description: "Document has been submitted for approval.",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          "Failed to submit document for approval. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Document Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {document.rejectionReason && (
            <div className="grid justify-start items-center ">
              <span className="text-sm font-medium border-b">Rejected</span>
              <span className="text-sm font-medium">
                {document.rejectionReason}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            {getStatusBadge(document.status)}
          </div>

          <div className="relative border-l border-gray-200 ml-5 pl-4">
            {/* Timeline: Approved */}
            {document.approvedByUserInfo && (
              <div className="mb-6 relative">
                {/* Dot */}
                <span className="absolute -left-5 top-0 h-4 w-4 rounded-full bg-blue-500"></span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    {`${document.approvedByUserInfo.firstName[0]}${document.approvedByUserInfo.lastName[0]}`.toUpperCase()}
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{`${document.approvedByUserInfo.firstName} ${document.approvedByUserInfo.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      {document.approvedByUserInfo.email}
                    </span>
                    {document.approvedDate && (
                      <span className="text-xs text-muted-foreground">
                        Approved on {formatDate(document.approvedDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline: Reviewed */}
            {document.reviewedByUserInfo && (
              <div className="mb-6 relative">
                <span className="absolute -left-5 top-0 h-4 w-4 rounded-full bg-green-500"></span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    {`${document.reviewedByUserInfo.firstName[0]}${document.reviewedByUserInfo.lastName[0]}`.toUpperCase()}
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{`${document.reviewedByUserInfo.firstName} ${document.reviewedByUserInfo.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      {document.reviewedByUserInfo.email}
                    </span>
                    {document.reviewedDate && (
                      <span className="text-xs text-muted-foreground">
                        Reviewed on {formatDate(document.reviewedDate)}
                      </span>
                    )}
                    {document.reviewNotes && (
                      <span className="text-xs text-muted-foreground">
                        Notes: {document.reviewNotes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline: Rejected */}

            {document.rejectedByUserInfo && (
              <div className="relative">
                <span className="absolute -left-5 top-0 h-4 w-4 rounded-full bg-red-500"></span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white font-bold">
                    {`${document.rejectedByUserInfo.firstName[0]}${document.rejectedByUserInfo.lastName[0]}`.toUpperCase()}
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{`${document.rejectedByUserInfo.firstName} ${document.rejectedByUserInfo.lastName}`}</span>
                    <span className="text-xs text-muted-foreground">
                      {document.rejectedByUserInfo.email}
                    </span>
                    {document.rejectedDate && (
                      <span className="text-xs text-muted-foreground">
                        Rejected on {formatDate(document.rejectedDate)}
                      </span>
                    )}
                    {document.rejectionReason && (
                      <span className="text-xs text-muted-foreground">
                        Reason: {document.rejectionReason}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        {canSubmit && (
          <Button
            onClick={handleSubmitForApproval}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        )}

        {canReview && (
          <Dialog
            open={isReviewDialogOpen}
            onOpenChange={setIsReviewDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Review Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter your review notes..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReview} disabled={isSubmitting}>
                  {isSubmitting ? "Reviewing..." : "Mark for Review"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {canApprove && (
          <Dialog
            open={isApproveDialogOpen}
            onOpenChange={setIsApproveDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approvalNotes">
                    Approval Notes (Optional)
                  </Label>
                  <Textarea
                    id="approvalNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter approval notes..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleApprove} disabled={isSubmitting}>
                  {isSubmitting ? "Approving..." : "Approve Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {canReject && (
          <Dialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Rejecting..." : "Reject Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {!canSubmit && !canReview && !canApprove && !canReject && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            No actions available for current status
          </div>
        )}
      </div>
    </div>
  );
}
