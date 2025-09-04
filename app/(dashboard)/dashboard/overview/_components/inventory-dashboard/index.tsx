import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";

interface InventoryDistributionDashboardProps {
  data: {
    branch: string;
    stock: number;
    lowStock: number;
    outOfStock: number;
    totalItems?: number;
    totalValue?: number;
    categories?: Array<{
      name: string;
      count: number;
      value: number;
    }>;
    stockMovements?: Array<{
      date: string;
      in: number;
      out: number;
    }>;
  }[];
  loading: boolean;
}

const COLORS = [
  "#4F46E5",
  "#FF8042",
  "#FFBB28",
  "#00C49F",
  "#8884d8",
  "#10B981",
];

export const InventoryDistributionDashboard = ({
  data,
  loading,
}: InventoryDistributionDashboardProps) => {
  if (loading) return <div className="p-4">Loading inventory data...</div>;

  // Calculate summary metrics
  const totalStock = data.reduce((sum, branch) => sum + branch.stock, 0);
  const totalLowStock = data.reduce((sum, branch) => sum + branch.lowStock, 0);
  const totalOutOfStock = data.reduce(
    (sum, branch) => sum + branch.outOfStock,
    0
  );
  const totalItems = data.reduce(
    (sum, branch) => sum + (branch.totalItems || 0),
    0
  );
  const totalValue = data.reduce(
    (sum, branch) => sum + (branch.totalValue || 0),
    0
  );

  // Mock data for categories and stock movements (replace with real data)
  const categoryData = [
    { name: "Electronics", count: 450, value: 125000 },
    { name: "Clothing", count: 320, value: 45000 },
    { name: "Home & Garden", count: 280, value: 35000 },
    { name: "Sports", count: 200, value: 28000 },
    { name: "Books", count: 150, value: 12000 },
  ];

  const stockMovementData = [
    { date: "Mon", in: 1250, out: 980 },
    { date: "Tue", in: 1100, out: 1050 },
    { date: "Wed", in: 1350, out: 920 },
    { date: "Thu", in: 980, out: 1150 },
    { date: "Fri", in: 1200, out: 1080 },
    { date: "Sat", in: 850, out: 750 },
    { date: "Sun", in: 950, out: 680 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-xl font-bold text-blue-600">
                {totalStock.toLocaleString()}
              </p>
            </div>
            <Package className="h-6 w-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-xl font-bold text-orange-600">
                {totalLowStock}
              </p>
            </div>
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl font-bold text-red-600">
                {totalOutOfStock}
              </p>
            </div>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold text-green-600">
                ${(totalValue / 1000).toFixed(1)}K
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Main Inventory Distribution Chart */}
      <Card className="p-4">
        <CardTitle className="mb-4 text-lg">
          Inventory Distribution by Branch
        </CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" stackId="a" fill="#4F46E5" name="In Stock" />
            <Bar
              dataKey="lowStock"
              stackId="a"
              fill="#FFBB28"
              name="Low Stock"
            />
            <Bar
              dataKey="outOfStock"
              stackId="a"
              fill="#FF8042"
              name="Out of Stock"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">Inventory by Category</CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Stock Movements */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">
            Stock Movements (7 Days)
          </CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stockMovementData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="in"
                stroke="#10B981"
                strokeWidth={2}
                name="Stock In"
              />
              <Line
                type="monotone"
                dataKey="out"
                stroke="#EF4444"
                strokeWidth={2}
                name="Stock Out"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Branch Performance */}
      <Card className="p-4">
        <CardTitle className="mb-4 text-lg">
          Branch Performance Overview
        </CardTitle>
        <div className="space-y-4">
          {data.map((branch, index) => {
            const utilization = branch.totalItems
              ? (branch.stock / branch.totalItems) * 100
              : 0;
            const lowStockPercentage = branch.totalItems
              ? (branch.lowStock / branch.totalItems) * 100
              : 0;

            return (
              <div
                key={branch.branch}
                className="space-y-3 p-3 border rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{branch.branch}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {branch.stock} in stock
                    </Badge>
                    {branch.lowStock > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs text-orange-600"
                      >
                        {branch.lowStock} low stock
                      </Badge>
                    )}
                    {branch.outOfStock > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {branch.outOfStock} out of stock
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Warehouse Utilization</span>
                    <span>{utilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={utilization} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Stock Alert</span>
                    <span>{lowStockPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={lowStockPercentage} className="h-2" />
                </div>

                {branch.totalValue && (
                  <div className="text-sm text-muted-foreground">
                    Total Value: ${branch.totalValue.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
