import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  Truck,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  description: string;
  timestamp: string;
  priority: "low" | "medium" | "high" | "critical";
  category: "inventory" | "finance" | "operations" | "customers" | "suppliers";
  actionRequired: boolean;
}

interface AlertsDashboardProps {
  alerts: Alert[];
  loading: boolean;
}

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "info":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityColor = (priority: Alert["priority"]) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryIcon = (category: Alert["category"]) => {
  switch (category) {
    case "inventory":
      return <Package className="h-4 w-4" />;
    case "finance":
      return <DollarSign className="h-4 w-4" />;
    case "operations":
      return <Truck className="h-4 w-4" />;
    case "customers":
      return <Users className="h-4 w-4" />;
    case "suppliers":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

export const AlertsDashboard = ({ alerts, loading }: AlertsDashboardProps) => {
  if (loading) {
    return (
      <Card className="p-4">
        <CardTitle className="mb-4">Business Alerts</CardTitle>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  // Mock alerts data (replace with real data when available)
  const mockAlerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      title: "Low Stock Alert",
      description: "15 items are running low on stock and need reordering",
      timestamp: "2 hours ago",
      priority: "high",
      category: "inventory",
      actionRequired: true,
    },
    {
      id: "2",
      type: "error",
      title: "Payment Overdue",
      description: "3 customer invoices are overdue by more than 30 days",
      timestamp: "4 hours ago",
      priority: "critical",
      category: "finance",
      actionRequired: true,
    },
    {
      id: "3",
      type: "info",
      title: "Shipment Delayed",
      description: "Order #12345 has been delayed due to weather conditions",
      timestamp: "6 hours ago",
      priority: "medium",
      category: "operations",
      actionRequired: false,
    },
    {
      id: "4",
      type: "success",
      title: "Monthly Target Achieved",
      description: "Sales team has achieved 105% of monthly revenue target",
      timestamp: "1 day ago",
      priority: "low",
      category: "customers",
      actionRequired: false,
    },
    {
      id: "5",
      type: "warning",
      title: "Supplier Performance",
      description: "2 suppliers have missed delivery deadlines this week",
      timestamp: "1 day ago",
      priority: "medium",
      category: "suppliers",
      actionRequired: true,
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const criticalAlerts = displayAlerts.filter(
    (alert) => alert.priority === "critical"
  );
  const highPriorityAlerts = displayAlerts.filter(
    (alert) => alert.priority === "high"
  );
  const actionRequiredAlerts = displayAlerts.filter(
    (alert) => alert.actionRequired
  );

  return (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-xl font-bold text-red-600">
                {criticalAlerts.length}
              </p>
            </div>
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-xl font-bold text-orange-600">
                {highPriorityAlerts.length}
              </p>
            </div>
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Action Required</p>
              <p className="text-xl font-bold text-blue-600">
                {actionRequiredAlerts.length}
              </p>
            </div>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-xl font-bold text-green-600">
                {displayAlerts.length}
              </p>
            </div>
            <AlertTriangle className="h-6 w-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </div>

          <div className="space-y-3">
            {displayAlerts.slice(0, 8).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-lg ${
                  alert.priority === "critical"
                    ? "border-red-200 bg-red-50"
                    : alert.priority === "high"
                    ? "border-orange-200 bg-orange-50"
                    : alert.priority === "medium"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(
                          alert.priority
                        )}`}
                      >
                        {alert.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(alert.category)}
                          {alert.category}
                        </div>
                      </Badge>
                      {alert.actionRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {alert.timestamp}
                      </span>
                      {alert.actionRequired && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Acknowledge
                          </Button>
                          <Button size="sm">Take Action</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4 text-lg">Quick Actions</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-5 w-5" />
              <span className="text-xs">Reorder Items</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Send Reminders</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Truck className="h-5 w-5" />
              <span className="text-xs">Track Shipments</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs">Contact Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

