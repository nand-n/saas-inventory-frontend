"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";
import FinancialDashboard from "./_components/financial-dashboard";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import dayjs from "dayjs";
import DateRangeSelector from "@/components/ui/date-range-selector";
import { DateRange } from "react-day-picker";
import { InventoryDistributionDashboard } from "./_components/inventory-dashboard";

const inventoryData = [
  { branch: "Main Warehouse", stock: 4500, lowStock: 150, outOfStock: 25 },
  { branch: "North Branch", stock: 3200, lowStock: 200, outOfStock: 15 },
  { branch: "Export Hub", stock: 6800, lowStock: 300, outOfStock: 40 },
];

const orderStatusData = [
  { status: "Pending", value: 120 },
  { status: "Processing", value: 45 },
  { status: "Shipped", value: 85 },
  { status: "Delivered", value: 200 },
];

const shipmentData = [
  { day: "Mon", air: 5, sea: 12, land: 35 },
  { day: "Tue", air: 7, sea: 15, land: 40 },
  { day: "Wed", air: 4, sea: 10, land: 30 },
  { day: "Thu", air: 6, sea: 18, land: 45 },
  { day: "Fri", air: 8, sea: 20, land: 50 },
];

const supplyChainMetrics = [
  { branch: "NYC", inventoryValue: 450000, turnover: 3.2, accuracy: 98.5 },
  { branch: "LON", inventoryValue: 320000, turnover: 2.8, accuracy: 97.2 },
  { branch: "DXB", inventoryValue: 680000, turnover: 4.1, accuracy: 99.0 },
];

const recentTransactions = [
  {
    id: 1,
    type: "Stock Adjustment",
    item: "Frozen Goods",
    quantity: "+500",
    branch: "Main Warehouse",
  },
  {
    id: 2,
    type: "Purchase Order",
    item: "Packaging Materials",
    quantity: "2000",
    branch: "Export Hub",
  },
  {
    id: 3,
    type: "Shipment",
    item: "Electronics",
    quantity: "-1500",
    branch: "North Branch",
  },
  {
    id: 4,
    type: "Return",
    item: "Perishables",
    quantity: "+200",
    branch: "Main Warehouse",
  },
];

const COLORS = [
  "#00C49F",
  "#FF8042",
  "#FFBB28",
  "#0088FE",
  "#82ca9d",
  "#ffc658",
];

const insights = [
  { label: "Total Inventory Value", value: "$1.45M" },
  { label: "Avg. Turnover Rate", value: "3.4x" },
  { label: "Order Accuracy", value: "98.2%" },
  { label: "Pending Orders", value: "165" },
  { label: "In-Transit", value: "89" },
  { label: "Warehouse Utilization", value: "82%" },
];

const branchData = [
  { name: "North Branch", value: 35 },
  { name: "Main Warehouse", value: 45 },
  { name: "Export Hub", value: 20 },
];

const InventoryDashboard = () => {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, "month");

  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: oneMonthAgo.toDate(),
    to: today.toDate(),
  });

  const {
    data: financialData,
    loading: financialDataLoading,
    execute: fetchFinancialData,
  } = useAsync(async () => {
    const startDate = selectedRange.from
      ? dayjs(selectedRange.from).format("YYYY-MM-DD")
      : "";
    const endDate = selectedRange.to
      ? dayjs(selectedRange.to).format("YYYY-MM-DD")
      : "";

    const res = await axiosInstance.get(
      `/accounting/journals/summary?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data;
  }, true);

  const {
    data: inventoryDistribution,
    loading: inventoryLoading,
    execute: fetchInventoryDistribution,
  } = useAsync(async () => {
    const startDate = selectedRange.from
      ? dayjs(selectedRange.from).format("YYYY-MM-DD")
      : "";
    const endDate = selectedRange.to
      ? dayjs(selectedRange.to).format("YYYY-MM-DD")
      : "";

    const res = await axiosInstance.get(
      `/inventory/inventory-items/summary/distribution?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data;
  }, true);

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
    fetchFinancialData();
    fetchInventoryDistribution();
  };

  return (
    <Card className="h-full w-full p-4 space-y-4">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold">
          Supply Chain Intelligence Dashboard
        </CardTitle>
        <div className="flex gap-2">
          <select className="p-2 border rounded-lg">
            <option>All Branches</option>
            <option>Main Warehouse</option>
            <option>North Branch</option>
            <option>Export Hub</option>
          </select>
          <DateRangeSelector
            selectedRange={selectedRange}
            onChange={handleRangeChange}
          />
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-sm text-muted-foreground">{insight.label}</p>
            <p className="text-xl font-semibold mt-2">{insight.value}</p>
          </Card>
        ))}
      </CardContent>

      {financialData && (
        <FinancialDashboard
          data={financialData}
          loading={financialDataLoading}
        />
      )}

      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Inventory Distribution by Branch
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" stackId="a" fill="#4F46E5" />
              <Bar dataKey="lowStock" stackId="a" fill="#FFBB28" />
              <Bar dataKey="outOfStock" stackId="a" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </Card> */}
        {inventoryDistribution && (
          <InventoryDistributionDashboard
            data={inventoryDistribution}
            loading={inventoryLoading}
          />
        )}

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>

      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Shipment Methods Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shipmentData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="air" stroke="#FF8042" />
              <Line type="monotone" dataKey="sea" stroke="#0088FE" />
              <Line type="monotone" dataKey="land" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Branch Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="turnover" name="Turnover Rate" />
              <YAxis type="number" dataKey="accuracy" name="Accuracy %" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Branches"
                data={supplyChainMetrics}
                fill="#4F46E5"
              />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-2 hover:bg-muted/50 rounded"
              >
                <div>
                  <p className="text-sm font-medium">{txn.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {txn.item} • {txn.branch}
                  </p>
                </div>
                <span className="text-sm font-medium">{txn.quantity}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Warehouse Utilization</h3>
          <div className="flex items-center justify-between h-full">
            <ResponsiveContainer width="40%" height={150}>
              <PieChart>
                <Pie
                  data={branchData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                >
                  {branchData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {branchData.map((branch) => (
                <div key={branch.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[branchData.indexOf(branch) % COLORS.length],
                    }}
                  />
                  <span className="text-sm">
                    {branch.name}: {branch.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default InventoryDashboard;
