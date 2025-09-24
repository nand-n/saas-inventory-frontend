"use client";

import React from "react";
import { Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CustomsDocument } from "@/types/shipment.types";
import CustomsDocumentApproval from "./customs-document-approval";

interface CustomsDocumentDetailsProps {
  document: CustomsDocument;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
  currentUserId?: string;
  onStatusChange?: () => void;
}

const CustomsDocumentDetails: React.FC<CustomsDocumentDetailsProps> = ({
  document,
  onClose,
  onEdit,
  canEdit = false,
  currentUserId,
  onStatusChange,
}) => {
  const statusBadge = () => {
    switch (document.status) {
      case "pending_approval":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending Approval
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Document: {document.documentNumber}
          </h2>
          {statusBadge()}
        </div>
        <div className="flex space-x-2">
          {canEdit && onEdit && <Button onClick={onEdit}>Edit</Button>}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* General Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID</p>
            <p className="font-medium">{document.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium uppercase">{document.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Issued Date</p>
            <p className="font-medium">{formatDate(document.issuedDate)}</p>
          </div>
          {document.expiryDate && (
            <div>
              <p className="text-muted-foreground">Expiry Date</p>
              <p className="font-medium">{formatDate(document.expiryDate)}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Issuing Authority</p>
            <p className="font-medium">{document.issuingAuthority}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Issuing Country</p>
            <p className="font-medium">{document.issuingCountry}</p>
          </div>
          {document.description && (
            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium">{document.description}</p>
            </div>
          )}
          {document.content && (
            <div>
              <p className="text-muted-foreground">Content</p>
              <p className="font-medium">{document.content}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Requires Approval</p>
            <p className="font-medium">
              {document.requiresApproval ? "Yes" : "No"}
            </p>
          </div>
          {document.approvedBy && (
            <div>
              <p className="text-muted-foreground">Approved By</p>
              <p className="font-medium">{document.approvedBy}</p>
            </div>
          )}
          {document.approvedDate && (
            <div>
              <p className="text-muted-foreground">Approved Date</p>
              <p className="font-medium">{formatDate(document.approvedDate)}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Created At</p>
            <p className="font-medium">{formatDate(document.createdAt ?? "")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated At</p>
            <p className="font-medium">{formatDate(document.updatedAt ?? "")}</p>
          </div>
          {document.deletedAt && (
            <div>
              <p className="text-muted-foreground">Deleted At</p>
              <p className="font-medium">{formatDate(document.deletedAt)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* HS Code Info */}
      {document.hsCodeInfo && document.hsCodeInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>HS Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {document.hsCodeInfo.map((hs, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
              >
                <div>
                  <p className="text-muted-foreground">HS Code</p>
                  <p className="font-medium">{hs.hsCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{hs.description}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duty Rate</p>
                  <p className="font-medium">{Number(hs.dutyRate) * 100}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tax Rate</p>
                  <p className="font-medium">{Number(hs.taxRate) * 100}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {document.attachments && document.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {document.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {att.fileName} ({Math.round(att.fileSize / 1024)} KB)
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Declared Value & Notes */}
      {(document.declaredValue || document.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {document.declaredValue && (
              <div>
                <p className="text-muted-foreground">Declared Value</p>
                <p className="font-medium">
                  {formatCurrency(
                    Number(document.declaredValue),
                    // document.currency
                  )}
                </p>
              </div>
            )}
            {document.notes && (
              <div>
                <p className="text-muted-foreground">Notes</p>
                <p className="font-medium">{document.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipment Info */}
      {document.shipment && (
        <Card>
          <CardHeader>
            <CardTitle>Shipment Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1  md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tracking Number</p>
              <p className="font-medium">{document.shipment.trackingNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carrier</p>
              <p className="font-medium">{document.shipment.carrier}</p>
            </div>
            <div>
              <p className="text-muted-foreground ">Type</p>
              <p className="font-medium uppercase">{document.shipment.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{document.shipment.status}</p>
            </div>
            {document.shipment.containerNumber && (
              <div>
                <p className="text-muted-foreground">Container Number</p>
                <p className="font-medium">
                  {document.shipment.containerNumber}
                </p>
              </div>
            )}
            {document.shipment.vesselName && (
              <div>
                <p className="text-muted-foreground">Vessel Name</p>
                <p className="font-medium">{document.shipment.vesselName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approval Workflow */}
      {currentUserId && (
        <CustomsDocumentApproval
          document={document}
          currentUserId={currentUserId}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

export default CustomsDocumentDetails;
