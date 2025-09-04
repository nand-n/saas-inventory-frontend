"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Package,
  Truck,
  Ship,
  Plane,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Navigation,
} from "lucide-react";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import { Shipment, ShipmentStatus } from "@/types/shipment.types";
import { formatDate } from "@/lib/utils";
import dayjs from "dayjs";

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  type: "departure" | "arrival" | "customs" | "delivery" | "exception";
}

interface ShipmentWithTracking extends Shipment {
  trackingEvents?: TrackingEvent[];
  estimatedTimeRemaining?: string;
  currentLocation?: string;
  nextMilestone?: string;
}

export default function ShipmentTrackingPage() {
  const { shipments, fetchShipments } = useShipmentsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithTracking | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Mock tracking events - in real app, these would come from API
  const generateTrackingEvents = (shipment: Shipment): TrackingEvent[] => {
    const events: TrackingEvent[] = [];
    const now = new Date();

    switch (shipment.status) {
      case ShipmentStatus.PENDING:
        events.push({
          id: "1",
          timestamp: shipment.createdAt,
          status: "Shipment Created",
          location: shipment.originAddress?.city || "Origin",
          description: "Shipment has been created and is pending pickup",
          type: "departure",
        });
        break;

      case ShipmentStatus.IN_TRANSIT:
        events.push(
          {
            id: "1",
            timestamp: shipment.createdAt,
            status: "Shipment Created",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has been created and is pending pickup",
            type: "departure",
          },
          {
            id: "2",
            timestamp: shipment.shippedDate || shipment.createdAt,
            status: "In Transit",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has departed from origin",
            type: "departure",
          },
          {
            id: "3",
            timestamp: new Date(
              now.getTime() - 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "In Transit",
            location: "En Route",
            description: "Shipment is currently in transit",
            type: "arrival",
          }
        );
        break;

      case ShipmentStatus.IN_CUSTOMS:
        events.push(
          {
            id: "1",
            timestamp: shipment.createdAt,
            status: "Shipment Created",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has been created and is pending pickup",
            type: "departure",
          },
          {
            id: "2",
            timestamp: shipment.shippedDate || shipment.createdAt,
            status: "In Transit",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has departed from origin",
            type: "departure",
          },
          {
            id: "3",
            timestamp: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "Arrived at Customs",
            location: shipment.portOfDischarge || "Customs",
            description: "Shipment has arrived at customs for clearance",
            type: "customs",
          }
        );
        break;

      case ShipmentStatus.DELIVERED:
        events.push(
          {
            id: "1",
            timestamp: shipment.createdAt,
            status: "Shipment Created",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has been created and is pending pickup",
            type: "departure",
          },
          {
            id: "2",
            timestamp: shipment.shippedDate || shipment.createdAt,
            status: "In Transit",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has departed from origin",
            type: "departure",
          },
          {
            id: "3",
            timestamp: shipment.actualDeliveryDate || new Date().toISOString(),
            status: "Delivered",
            location: shipment.destinationAddress?.city || "Destination",
            description: "Shipment has been successfully delivered",
            type: "delivery",
          }
        );
        break;

      case ShipmentStatus.DELAYED:
        events.push(
          {
            id: "1",
            timestamp: shipment.createdAt,
            status: "Shipment Created",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has been created and is pending pickup",
            type: "departure",
          },
          {
            id: "2",
            timestamp: shipment.shippedDate || shipment.createdAt,
            status: "In Transit",
            location: shipment.originAddress?.city || "Origin",
            description: "Shipment has departed from origin",
            type: "departure",
          },
          {
            id: "3",
            timestamp: new Date(
              now.getTime() - 12 * 60 * 60 * 1000
            ).toISOString(),
            status: "Delayed",
            location: "En Route",
            description:
              "Shipment is experiencing delays due to weather conditions",
            type: "exception",
          }
        );
        break;
    }

    return events;
  };

  const handleSearch = () => {
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    const shipment = shipments.find((s) =>
      s.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase())
    );

    if (shipment) {
      const shipmentWithTracking: ShipmentWithTracking = {
        ...shipment,
        trackingEvents: generateTrackingEvents(shipment),
        estimatedTimeRemaining: calculateEstimatedTime(shipment),
        currentLocation: getCurrentLocation(shipment),
        nextMilestone: getNextMilestone(shipment),
      };
      setSelectedShipment(shipmentWithTracking);
    }

    setIsSearching(false);
  };

  const calculateEstimatedTime = (shipment: Shipment): string => {
    if (shipment.status === ShipmentStatus.DELIVERED) return "Delivered";

    const now = new Date();
    const estimatedDate = shipment.estimatedDeliveryDate
      ? new Date(shipment.estimatedDeliveryDate)
      : null;

    if (!estimatedDate) return "Unknown";

    const diffTime = estimatedDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  const getCurrentLocation = (shipment: Shipment): string => {
    switch (shipment.status) {
      case ShipmentStatus.PENDING:
        return shipment.originAddress?.city || "Origin";
      case ShipmentStatus.IN_TRANSIT:
        return "En Route";
      case ShipmentStatus.IN_CUSTOMS:
        return shipment.portOfDischarge || "Customs";
      case ShipmentStatus.DELIVERED:
        return shipment.destinationAddress?.city || "Destination";
      case ShipmentStatus.DELAYED:
        return "En Route (Delayed)";
      default:
        return "Unknown";
    }
  };

  const getNextMilestone = (shipment: Shipment): string => {
    switch (shipment.status) {
      case ShipmentStatus.PENDING:
        return "Pickup by carrier";
      case ShipmentStatus.IN_TRANSIT:
        return shipment.portOfDischarge
          ? "Arrival at destination port"
          : "Customs clearance";
      case ShipmentStatus.IN_CUSTOMS:
        return "Customs clearance completion";
      case ShipmentStatus.CLEARED:
        return "Final delivery";
      case ShipmentStatus.DELIVERED:
        return "Completed";
      default:
        return "Next milestone";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "departure":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "arrival":
        return <Package className="h-4 w-4 text-green-600" />;
      case "customs":
        return <Ship className="h-4 w-4 text-yellow-600" />;
      case "delivery":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "exception":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.DELIVERED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case ShipmentStatus.IN_TRANSIT:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case ShipmentStatus.IN_CUSTOMS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case ShipmentStatus.DELAYED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shipment Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your shipments in real-time and monitor their progress
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Track Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !trackingNumber.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {selectedShipment && (
        <div className="space-y-6">
          {/* Shipment Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedShipment.trackingNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tracking Number
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedShipment.carrier}
                  </div>
                  <p className="text-sm text-muted-foreground">Carrier</p>
                </div>
                <div className="text-center">
                  <Badge
                    className={`text-lg px-4 py-2 ${getStatusColor(
                      selectedShipment.status
                    )}`}
                  >
                    {selectedShipment.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold">
                    {selectedShipment.currentLocation}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current Location
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold">
                    {selectedShipment.estimatedTimeRemaining}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Time
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold">
                    {selectedShipment.nextMilestone}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next Milestone
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold">
                    {selectedShipment.type}
                  </div>
                  <p className="text-sm text-muted-foreground">Shipment Type</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedShipment.trackingEvents?.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getStatusIcon(event.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.status}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Origin</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedShipment.originAddress?.street}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedShipment.originAddress?.city}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedShipment.originAddress?.country}
                    </p>
                    {selectedShipment.shippedDate && (
                      <p>
                        <strong>Shipped Date:</strong>{" "}
                        {formatDate(selectedShipment.shippedDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Destination</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedShipment.destinationAddress?.street}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedShipment.destinationAddress?.city}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedShipment.destinationAddress?.country}
                    </p>
                    {selectedShipment.estimatedDeliveryDate && (
                      <p>
                        <strong>Estimated Delivery:</strong>{" "}
                        {formatDate(selectedShipment.estimatedDeliveryDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Shipments */}
      {!selectedShipment && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipments.slice(0, 5).map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setTrackingNumber(shipment.trackingNumber);
                    handleSearch();
                  }}
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
                      {shipment.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
