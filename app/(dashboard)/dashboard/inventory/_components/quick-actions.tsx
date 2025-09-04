import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Settings,
} from "lucide-react";

interface QuickActionsProps {
  onBulkExport: () => void;
  onBulkImport: () => void;
  onLowStockReport: () => void;
  onInventoryAudit: () => void;
  onRefresh: () => void;
  lowStockCount: number;
  outOfStockCount: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onBulkExport,
  onBulkImport,
  onLowStockReport,
  onInventoryAudit,
  onRefresh,
  lowStockCount,
  outOfStockCount,
}) => {
  const actions = [
    {
      title: "Export Inventory",
      description: "Export all inventory data to CSV/Excel",
      icon: Download,
      onClick: onBulkExport,
      variant: "outline" as const,
      color: "text-blue-600",
    },
    {
      title: "Import Inventory",
      description: "Bulk import inventory items from file",
      icon: Upload,
      onClick: onBulkImport,
      variant: "outline" as const,
      color: "text-green-600",
    },
    {
      title: "Low Stock Report",
      description: `View ${lowStockCount} items below reorder level`,
      icon: AlertTriangle,
      onClick: onLowStockReport,
      variant: "outline" as const,
      color: "text-yellow-600",
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      title: "Inventory Audit",
      description: "Perform physical inventory count",
      icon: Package,
      onClick: onInventoryAudit,
      variant: "outline" as const,
      color: "text-purple-600",
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed inventory analytics",
      icon: BarChart3,
      onClick: () => {},
      variant: "outline" as const,
      color: "text-indigo-600",
    },
    {
      title: "Settings",
      description: "Configure inventory preferences",
      icon: Settings,
      onClick: () => {},
      variant: "outline" as const,
      color: "text-gray-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Common inventory operations and reports
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start gap-3 text-left"
                onClick={action.onClick}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className={`h-5 w-5 ${action.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  {action.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {action.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Status Summary */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">
                  Low Stock Items:{" "}
                  <span className="font-medium text-yellow-600">
                    {lowStockCount}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-red-600" />
                <span className="text-sm text-muted-foreground">
                  Out of Stock:{" "}
                  <span className="font-medium text-red-600">
                    {outOfStockCount}
                  </span>
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
