"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import { useCustomsDocumentsStore } from "@/store/customs-documents/useCustomsDocumentsStore";
import { ShipmentStatus, ShipmentType } from "@/types/shipment.types";
import { CustomsDocumentStatus } from "@/types/shipment.types";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import Link from "next/link";

export default function LogisticsDashboard() {
  const { shipments, stats, fetchShipments } = useShipmentsStore();
  const { customsDocuments, fetchCustomsDocuments } =
    useCustomsDocumentsStore();
  const [recentShipments, setRecentShipments] = useState([]);
  const [recentCustomsDocuments, setRecentCustomsDocuments] = useState([]);

  useEffect(() => {
    fetchShipments();
    fetchCustomsDocuments();
  }, [fetchShipments, fetchCustomsDocuments]);

  useEffect(() => {
    if (shipments.length > 0) {
      setRecentShipments(shipments.slice(0, 5) as any);
    }
  }, [shipments]);

  useEffect(() => {
    if (customsDocuments.length > 0) {
      setRecentCustomsDocuments(customsDocuments.slice(0, 5) as any);
    }
  }, [customsDocuments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_transit":
      case "pending_approval":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "delayed":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "in_customs":
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "in_transit":
      case "pending_approval":
        return <Clock className="h-4 w-4" />;
      case "delayed":
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      case "in_customs":
      case "under_review":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Logistics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Overview of shipments, customs documents, and logistics operations
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/shipment">
            <Button>
              <Truck className="h-4 w-4 mr-2" />
              Manage Shipments
            </Button>
          </Link>
          <Link href="/dashboard/customs-documents">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Customs Documents
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShipments}</div>
            <p className="text-xs text-muted-foreground">Across all statuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Customs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inCustoms}</div>
            <p className="text-xs text-muted-foreground">Awaiting clearance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipment Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(ShipmentType).map((type) => {
                const count = shipments.filter((s) => s.type === type).length;
                const percentage =
                  stats.totalShipments > 0
                    ? ((count / stats.totalShipments) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="capitalize">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-sm text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customs Documents Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(CustomsDocumentStatus)
                .slice(0, 6)
                .map((status) => {
                  const count = customsDocuments.filter(
                    (d) => d.status === status
                  ).length;
                  return (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="capitalize">
                          {status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShipments.map((shipment: any) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{shipment.trackingNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.carrier}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(shipment.status)}>
                      {getStatusIcon(shipment.status)}
                      <span className="ml-1 capitalize">
                        {shipment.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customs Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomsDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.documentNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(doc.status)}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 capitalize">
                        {doc.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/shipment">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <Truck className="h-6 w-6" />
                <span>New Shipment</span>
              </Button>
            </Link>
            <Link href="/dashboard/customs-documents">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Customs Document</span>
              </Button>
            </Link>
            <Link href="/dashboard/logistics/tracking">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col gap-2"
              >
                <MapPin className="h-6 w-6" />
                <span>Track Shipment</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
