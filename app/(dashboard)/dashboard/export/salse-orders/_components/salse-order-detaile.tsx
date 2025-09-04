"use client";

import React from "react";
import { Edit, Calendar, ClipboardList, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SalesOrder } from "@/types/sales-order.types";

interface SalesOrderDetailsProps {
  salesOrder: SalesOrder;
  onEdit?: () => void;
  onClose: () => void;
  canEdit?: boolean;
}

const SalesOrderDetails: React.FC<SalesOrderDetailsProps> = ({
  salesOrder,
  onEdit,
  onClose,
  canEdit = false,
}) => {
  const statusBadge = () => {
    switch (salesOrder.status) {
      case "draft":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Draft
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Confirmed
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Shipped
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
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
            Sales Order: {salesOrder.soNumber}
          </h2>
          {statusBadge()}
        </div>
        <div className="flex space-x-2">
          {canEdit && onEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{salesOrder.customer.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Code</p>
            <p className="font-medium">{salesOrder.customer.code}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact</p>
            <p className="font-medium">{salesOrder.customer.contactPerson}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{salesOrder.customer.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{salesOrder.customer.phone}</p>
          </div>
          {salesOrder.customer.address && (
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">
                {salesOrder.customer.address.street},{" "}
                {salesOrder.customer.address.city},{" "}
                {salesOrder.customer.address.state}{" "}
                {salesOrder.customer.address.zipCode},{" "}
                {salesOrder.customer.address.country}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">
                  {formatDate(salesOrder.orderDate)}
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
                  {formatCurrency(Number(salesOrder.totalAmount))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Order Status</p>
                <p className="font-semibold uppercase ">{salesOrder.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Order Items ({salesOrder.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {salesOrder.items.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No items found.</p>
          ) : (
            salesOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} ×{" "}
                    {formatCurrency(Number(item.unit_price))}
                  </p>
                </div>
                <div className="font-semibold">
                  {formatCurrency(Number(item.lineTotal))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>System Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {salesOrder.createdAt && (
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(salesOrder.createdAt)}</p>
            </div>
          )}
          {salesOrder.updatedAt && (
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(salesOrder.updatedAt)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderDetails;
