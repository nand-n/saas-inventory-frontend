"use client";

import React from "react";
import { Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RFQ } from "@/types/rfq.types";

interface RfqDetailsProps {
  rfq: RFQ;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

const RfqDetails: React.FC<RfqDetailsProps> = ({
  rfq,
  onClose,
  onEdit,
  canEdit = false,
}) => {
  const statusBadge = () => {
    switch (rfq.status) {
      case "draft":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Draft
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Sent
          </span>
        );
      case "awarded":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Awarded
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Closed
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
            RFQ: {rfq.rfqNumber}
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

      {/* Supplier Info */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{rfq.supplier?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-medium">{rfq.supplier?.contactPerson}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{rfq.supplier?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{rfq.supplier?.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">
              {rfq.supplier?.address?.street}, {rfq.supplier?.address?.city},{" "}
              {rfq.supplier?.address?.country}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Issued Date</p>
                <p className="font-semibold">
                  {formatDate(String(rfq.issuedDate))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className="font-semibold">
                  {formatDate(String(rfq.validUntil))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold">
                  {formatCurrency(Number(rfq.totalAmount))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rfq.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="space-y-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} ×{" "}
                  {formatCurrency(Number(item.expectedUnitCost))}
                </p>
              </div>
              <div className="font-semibold">
                {formatCurrency(Number(item.lineTotal))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>System Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">{formatDate(String(rfq.createdAt))}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{formatDate(String(rfq.updatedAt))}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RfqDetails;
