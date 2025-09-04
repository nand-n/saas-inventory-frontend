import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InventoryAnalyticsProps {
  summaryData: any[];
  isLoading: boolean;
}

const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
  summaryData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summaryData || summaryData.length === 0) {
    return null;
  }

  // Calculate analytics
  const totalItems = summaryData.reduce(
    (acc, branch) => acc + Number(branch.total_items),
    0
  );
  const totalQuantity = summaryData.reduce(
    (acc, branch) => acc + Number(branch.total_quantity),
    0
  );
  const totalValue = summaryData.reduce(
    (acc, branch) => acc + Number(branch.total_value),
    0
  );

  // Find top performing branches
  const topBranches = [...summaryData]
    .sort((a, b) => Number(b.total_value) - Number(a.total_value))
    .slice(0, 3);

  // Calculate inventory health
  const lowStockBranches = summaryData.filter((branch) => {
    const avgQuantity =
      Number(branch.total_quantity) / Number(branch.total_items);
    return avgQuantity <= 5; // Consider low stock if average quantity per item is <= 5
  });

  const inventoryHealth =
    ((summaryData.length - lowStockBranches.length) / summaryData.length) * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {summaryData.length} branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quantity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQuantity.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalItems > 0 ? Math.round(totalQuantity / totalItems) : 0} avg
              per item
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalItems > 0
                ? formatCurrency(totalValue / totalItems)
                : formatCurrency(0)}{" "}
              avg per item
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Health
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(inventoryHealth)}%
            </div>
            <div className="mt-2">
              <Progress value={inventoryHealth} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockBranches.length} branches need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Branches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Branches</CardTitle>
          <p className="text-sm text-muted-foreground">
            Branches with highest inventory value
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBranches.map((branch, index) => (
              <div
                key={branch.branch_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      index === 0
                        ? "default"
                        : index === 1
                        ? "secondary"
                        : "outline"
                    }
                  >
                    #{index + 1}
                  </Badge>
                  <div>
                    <div className="font-medium">{branch.branch_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {branch.total_items} items • {branch.total_quantity}{" "}
                      quantity
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(Number(branch.total_value))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {totalValue > 0
                      ? Math.round(
                          (Number(branch.total_value) / totalValue) * 100
                        )
                      : 0}
                    % of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Inventory Distribution by Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summaryData.map((branch) => {
                const itemPercentage =
                  totalItems > 0
                    ? (Number(branch.total_items) / totalItems) * 100
                    : 0;
                const quantityPercentage =
                  totalQuantity > 0
                    ? (Number(branch.total_quantity) / totalQuantity) * 100
                    : 0;

                return (
                  <div key={branch.branch_id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{branch.branch_name}</span>
                      <span className="text-muted-foreground">
                        {branch.total_items} items
                      </span>
                    </div>
                    <Progress value={itemPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(itemPercentage)}% of items</span>
                      <span>{Math.round(quantityPercentage)}% of quantity</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock Level Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.map((branch) => {
                const avgQuantity =
                  Number(branch.total_quantity) / Number(branch.total_items);
                const stockLevel =
                  avgQuantity <= 5
                    ? "low"
                    : avgQuantity <= 15
                    ? "medium"
                    : "high";

                return (
                  <div
                    key={branch.branch_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{branch.branch_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Avg: {Math.round(avgQuantity)} per item
                      </div>
                    </div>
                    <Badge
                      variant={
                        stockLevel === "low"
                          ? "destructive"
                          : stockLevel === "medium"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {stockLevel.charAt(0).toUpperCase() + stockLevel.slice(1)}{" "}
                      Stock
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
