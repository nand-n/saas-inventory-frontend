"use client";

import React from "react";

import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  Award,
  Globe,
  Package,
  Star,
  FileText,
} from "lucide-react";

import { Supplier } from "@/types/supplier.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface SupplierDetailsProps {
  supplier: Supplier | null;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
  supplier,
  onEdit,
  onClose,
  canEdit,
}) => {
  if (!supplier) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {supplier.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {supplier.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {supplier.contactPerson}
            </p>
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                supplier.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {supplier.status.charAt(0).toUpperCase() +
                supplier.status.slice(1)}
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
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Performance Rating
                </p>
                <p className="font-semibold">{supplier.performanceRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lead Time (Days)
                </p>
                <p className="font-semibold">{supplier.leadTimeDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Terms
                </p>
                <p className="font-semibold">{supplier.paymentTerms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supplier Code
                </p>
                <p className="font-semibold">{supplier.code}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Address</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            {supplier.address.street}, {supplier.address.city},{" "}
            {supplier.address.state}, {supplier.address.country}{" "}
            {supplier.address.zipCode}
          </p>
        </CardContent>
      </Card>
      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{supplier.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium">{supplier.phone}</p>
              </div>
            </div>

            {supplier.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </p>
                  <p className="font-medium">
                    {supplier.address.street}, {supplier.address.city},{" "}
                    {supplier.address.state}, {supplier.address.country}{" "}
                    {supplier.address.zipCode}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              {supplier.notes || "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      {supplier.products && supplier.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {supplier.products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: {product.sku} | Category: {product.category}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
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
              <p className="text-gray-600 dark:text-gray-400">Created</p>
              <p className="font-medium">
                {formatDate(supplier?.createdAt ?? "")}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="font-medium">
                {formatDate(supplier?.updatedAt ?? "")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDetails;
