"use client";

import React from "react";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Package,
  User,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Customer } from "@/types/customers.types";

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onEdit,
  onClose,
  canEdit,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex  items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Code: {customer.code} • Contact: {customer.contactPerson}
            </p>
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                customer.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : customer.status === "inactive"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {customer.status.charAt(0).toUpperCase() +
                customer.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
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

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code</p>
                <p className="font-semibold">{customer.code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact Person
                </p>
                <p className="font-semibold">{customer.contactPerson}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="font-semibold">{customer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-semibold">{customer.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address */}
      {customer.address && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{customer.address.street ?? "-"}</p>
            <p>
              {customer.address.city ?? ""} {customer.address.state ?? ""}
            </p>
            <p>
              {customer.address.country ?? ""} {customer.address.zipCode ?? ""}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sales Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Sales Orders ({customer?.salesOrders?.length ?? 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.salesOrders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No sales orders found.
            </p>
          ) : (
            <div className="space-y-4">
              {customer.salesOrders.map((so) => (
                <div
                  key={so.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{so.soNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className="uppercase">{so.status}</span> •
                      Order Date: {formatDate(so.orderDate)}
                    </p>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(Number(so.totalAmount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {customer.createdAt && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="font-medium">{formatDate(customer.createdAt)}</p>
              </div>
            )}
            {customer.updatedAt && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="font-medium">{formatDate(customer.updatedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetails;
