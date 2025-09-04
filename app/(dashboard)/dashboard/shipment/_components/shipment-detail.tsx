"use client";

import React from "react";
import { Calendar, Package, Truck, MapPin, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Shipment } from "@/types/shipment.types";

interface ShipmentDetailsProps {
  shipment: Shipment;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({
  shipment,
  onClose,
  onEdit,
  canEdit = false,
}) => {
  const statusBadge = () => {
    switch (shipment.status) {
      case "in_transit":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Delivered
          </span>
        );
      case "delayed":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Delayed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
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
            Shipment: {shipment.trackingNumber}
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

      {/* Carrier & General Info */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Carrier</p>
            <p className="font-medium">{shipment.carrier}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{shipment.type}</p>
          </div>
          {shipment.containerNumber && (
            <div>
              <p className="text-muted-foreground">Container Number</p>
              <p className="font-medium">{shipment.containerNumber}</p>
            </div>
          )}
          {shipment.vesselName && (
            <div>
              <p className="text-muted-foreground">Vessel Name</p>
              <p className="font-medium">{shipment.vesselName}</p>
            </div>
          )}
          {shipment.portOfLoading && (
            <div>
              <p className="text-muted-foreground">Port of Loading</p>
              <p className="font-medium">{shipment.portOfLoading}</p>
            </div>
          )}
          {shipment.portOfDischarge && (
            <div>
              <p className="text-muted-foreground">Port of Discharge</p>
              <p className="font-medium">{shipment.portOfDischarge}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shipment.shippedDate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Shipped Date</p>
                  <p className="font-semibold">
                    {formatDate(shipment.shippedDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {shipment.estimatedDeliveryDate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Delivery
                  </p>
                  <p className="font-semibold">
                    {formatDate(shipment.estimatedDeliveryDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {shipment.actualDeliveryDate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Actual Delivery
                  </p>
                  <p className="font-semibold">
                    {formatDate(shipment.actualDeliveryDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground">Origin</p>
            <p className="font-medium">
              {shipment.originAddress.street}, {shipment.originAddress.city},{" "}
              {shipment.originAddress.country}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Destination</p>
            <p className="font-medium">
              {shipment.destinationAddress.street},{" "}
              {shipment.destinationAddress.city},{" "}
              {shipment.destinationAddress.country}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cost & Weight */}
      {(shipment.weight || shipment.shippingCost) && (
        <Card>
          <CardHeader>
            <CardTitle>Cost & Weight</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shipment.weight && (
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p className="font-medium">{shipment.weight} kg</p>
              </div>
            )}
            {shipment.shippingCost && (
              <div>
                <p className="text-muted-foreground">Shipping Cost</p>
                <p className="font-medium">
                  {formatCurrency(shipment.shippingCost)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Customs & Notes */}
      {(shipment.customsInfo || shipment.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shipment.customsInfo && (
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Customs Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Declaration Number:{" "}
                    </span>
                    <span className="font-medium">
                      {shipment.customsInfo.declarationNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duty Amount: </span>
                    <span className="font-medium">
                      {formatCurrency(shipment.customsInfo.dutyAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tax Amount: </span>
                    <span className="font-medium">
                      {formatCurrency(shipment.customsInfo.taxAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Clearance Date:{" "}
                    </span>
                    <span className="font-medium">
                      {formatDate(shipment.customsInfo.clearanceDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {shipment.notes && (
              <div>
                <p className="text-muted-foreground font-medium">Notes</p>
                <p className="font-medium">{shipment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentDetails;
