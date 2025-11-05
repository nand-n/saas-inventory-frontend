"use client";

import React from "react";
import {
  Edit,
  X,
  Calendar,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  User,
  Warehouse,
  FileText,
  Layers,
  Tag,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { GoodsReceipt } from "@/types/grn.types";

interface GoodsReceiptDetailsProps {
  grn: GoodsReceipt | null;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

const GoodsReceiptDetails: React.FC<GoodsReceiptDetailsProps> = ({
  grn,
  onEdit,
  onClose,
  canEdit,
}) => {
  if (!grn) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            GRN #{grn.grnNumber}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Linked to PO: {grn.purchaseOrder?.poNumber ?? "—"}
          </p>
          <span
            className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              grn.status
            )}`}
          >
            {grn.status}
          </span>
        </div>

        <div className="flex space-x-2">
          {canEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Received Date</p>
              <p className="font-semibold">
                {formatDate(grn.receivedDate ?? "")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <User className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Received By</p>
              <p className="font-semibold">{grn.receivedBy}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <Warehouse className="h-6 w-6 text-teal-600" />
            <div>
              <p className="text-sm text-gray-600">Warehouse</p>
              <p className="font-semibold">{grn.warehouse}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <ClipboardList className="h-6 w-6 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">QC Status</p>
              <p className="font-semibold">{grn.qcStatus}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QC Remarks */}
      {grn.qcRemarks && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>QC Remarks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{grn.qcRemarks}</p>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      {grn.items && grn.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Received Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {grn.items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Medicine Name</p>
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Layers className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Received Qty</p>
                      <p className="font-medium">{item.receivedQuantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Expiry</p>
                      <p className="font-medium">
                        {item.expiryDate
                          ? formatDate(item.expiryDate)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {item.batchNumber && (
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Batch No</p>
                        <p className="font-medium">{item.batchNumber}</p>
                      </div>
                    </div>
                  )}

                  {item.unit && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Unit Cost</p>
                        <p className="font-medium">{item.unit}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">
                {formatDate(grn?.createdAt ?? "")}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-medium">
                {formatDate(grn?.updatedAt ?? "")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodsReceiptDetails;
