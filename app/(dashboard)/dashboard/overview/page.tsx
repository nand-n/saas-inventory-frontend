"use client";
import React, { useState, useEffect } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import FinancialDashboard from "./_components/financial-dashboard";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import dayjs from "dayjs";
import DateRangeSelector from "@/components/ui/date-range-selector";
import { DateRange } from "react-day-picker";
import { InventoryDistributionDashboard } from "./_components/inventory-dashboard";
import { AlertsDashboard } from "./_components/alerts-dashboard";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Import stores for real data
import { useSalesOrderStore } from "@/store/so/useSalesOrderStore";
import { usePurchaseOrderStore } from "@/store/po/usePurchaseOrderStore";
import { useRfqStore } from "@/store/rfq/useRfqStore";
import { useSupplierStore } from "@/store/suppliers/useSupplierStore";
import { useCustomersStore } from "@/store/customers/useCustomersStore";
import { useEmployeeStore } from "@/store/hr/useEmployeeStore";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import { useCustomsDocumentsStore } from "@/store/customs-documents/useCustomsDocumentsStore";
import { Selector } from "@/components/ui/select";
import useTenantStore from "@/store/tenant/tenantStore";

const COLORS = [
  "#00C49F",
  "#FF8042",
  "#FFBB28",
  "#0088FE",
  "#82ca9d",
  "#ffc658",
  "#4F46E5",
  "#10B981",
];

const OverviewDashboard = () => {
  const { id: tenantId } = useTenantStore();

  const today = dayjs();
  const oneMonthAgo = today.subtract(1, "month");

  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: oneMonthAgo.toDate(),
    to: today.toDate(),
  });

  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Initialize stores
  const salesOrderStore = useSalesOrderStore();
  const purchaseOrderStore = usePurchaseOrderStore();
  const rfqStore = useRfqStore();
  const supplierStore = useSupplierStore();
  const customerStore = useCustomersStore();
  const employeeStore = useEmployeeStore();
  const shipmentsStore = useShipmentsStore();
  const customsDocumentsStore = useCustomsDocumentsStore();

  // Financial data
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
    data: branchs = [],
    loading: branchsLoading,
    execute: fetchBranchs,
  } = useAsync(
    () => axiosInstance.get(`branches/${tenantId}`).then((r) => r.data),
    false
  );

  useEffect(() => {
    if (tenantId) {
      fetchBranchs();
    }
  }, [tenantId]);

  // Inventory data
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

  // Dashboard summary data
  const {
    data: dashboardSummary,
    loading: summaryLoading,
    execute: fetchDashboardSummary,
  } = useAsync(async () => {
    const startDate = selectedRange.from
      ? dayjs(selectedRange.from).format("YYYY-MM-DD")
      : "";
    const endDate = selectedRange.to
      ? dayjs(selectedRange.to).format("YYYY-MM-DD")
      : "";

    const res = await axiosInstance.get(
      `/dashboard/summary?startDate=${startDate}&endDate=${endDate}&branch=${selectedBranch}`
    );
    return res.data;
  }, true);

  // Recent activities
  const {
    data: recentActivities,
    loading: activitiesLoading,
    execute: fetchRecentActivities,
  } = useAsync(async () => {
    const res = await axiosInstance.get(
      `/dashboard/recent-activities?limit=10`
    );
    return res.data;
  }, true);

  // Alerts data
  const {
    data: alertsData,
    loading: alertsLoading,
    execute: fetchAlerts,
  } = useAsync(async () => {
    const res = await axiosInstance.get(
      `/dashboard/alerts?branch=${selectedBranch}`
    );
    return res.data;
  }, true);

  // Performance metrics
  const {
    data: performanceMetrics,
    loading: performanceLoading,
    execute: fetchPerformanceMetrics,
  } = useAsync(async () => {
    const startDate = selectedRange.from
      ? dayjs(selectedRange.from).format("YYYY-MM-DD")
      : "";
    const endDate = selectedRange.to
      ? dayjs(selectedRange.to).format("YYYY-MM-DD")
      : "";

    const res = await axiosInstance.get(
      `/dashboard/performance-metrics?startDate=${startDate}&endDate=${endDate}&branch=${selectedBranch}`
    );
    return res.data;
  }, true);

  // Fetch all data on component mount and date range change
  useEffect(() => {
    fetchFinancialData();
    fetchInventoryDistribution();
    fetchDashboardSummary();
    fetchRecentActivities();
    fetchAlerts();
    fetchPerformanceMetrics();

    // Fetch store data
    salesOrderStore.fetchSalesOrders();
    purchaseOrderStore.fetchPurchaseOrders();
    rfqStore.fetchRfqs();
    supplierStore.fetchSuppliers();
    customerStore.fetchCustomers();
    employeeStore.fetchEmployees();
    shipmentsStore.fetchShipments();
    customsDocumentsStore.fetchCustomsDocuments();
  }, [selectedRange, selectedBranch]);

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
  };

  // Calculate KPIs from store data
  const kpis = {
    totalSales: salesOrderStore.stats.totalAmount || 0,
    totalOrders: salesOrderStore.stats.totalOrders || 0,
    pendingOrders: salesOrderStore.stats.confirmed || 0,
    completedOrders: salesOrderStore.stats.completed || 0,
    totalCustomers: customerStore.customers?.length || 0,
    totalSuppliers: supplierStore.suppliers?.length || 0,
    totalEmployees: employeeStore.employees?.length || 0,
    totalShipments: shipmentsStore.shipments?.length || 0,
  };

  // Mock data for charts (replace with real data when available)
  const orderTrendData = [
    { day: "Mon", orders: 45, revenue: 12500 },
    { day: "Tue", orders: 52, revenue: 14200 },
    { day: "Wed", orders: 38, revenue: 9800 },
    { day: "Thu", orders: 61, revenue: 16800 },
    { day: "Fri", orders: 48, revenue: 13200 },
    { day: "Sat", orders: 35, revenue: 8900 },
    { day: "Sun", orders: 42, revenue: 11500 },
  ];

  const topProducts = [
    { name: "Electronics", sales: 1250, revenue: 45000 },
    { name: "Clothing", sales: 980, revenue: 32000 },
    { name: "Home & Garden", sales: 750, revenue: 28000 },
    { name: "Sports", sales: 620, revenue: 22000 },
    { name: "Books", sales: 450, revenue: 15000 },
  ];

  const branchPerformance = [
    {
      branch: "Main Warehouse",
      efficiency: 92,
      utilization: 85,
      accuracy: 98.5,
    },
    { branch: "North Branch", efficiency: 88, utilization: 78, accuracy: 97.2 },
    { branch: "Export Hub", efficiency: 95, utilization: 92, accuracy: 99.1 },
    { branch: "South Depot", efficiency: 85, utilization: 72, accuracy: 96.8 },
  ];

  if (summaryLoading) {
    return (
      <div className="h-full w-full p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full w-full p-4 space-y-6">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Business Intelligence Dashboard
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive overview of your business performance and key metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Selector
            options={[
              ...(branchs?.map((branch: any) => ({
                label: branch?.name,
                value: branch?.id,
              })) || []),
            ]}
            value={selectedBranch}
            onValueChange={(value: string) => handleBranchChange(value)}
          />

          <DateRangeSelector
            selectedRange={selectedRange}
            onChange={handleRangeChange}
          />
        </div>
      </CardHeader>

      {/* Key Performance Indicators */}
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-blue-600">
                  ${(kpis.totalSales / 1000).toFixed(1)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold text-green-600">
                  {kpis.totalOrders}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+8.3%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Customers
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {kpis.totalCustomers}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+5.7%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Items</p>
                <p className="text-xl font-bold text-orange-600">
                  {inventoryDistribution?.totalItems || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600">-2.1%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-xl font-bold text-red-600">
                  {kpis.pendingOrders}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-yellow-600">Attention</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shipments</p>
                <p className="text-xl font-bold text-teal-600">
                  {kpis.totalShipments}
                </p>
              </div>
              <Truck className="h-8 w-8 text-teal-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">On Track</span>
            </div>
          </Card>
        </div>
      </CardContent>

      {/* Financial Dashboard */}
      {financialData && (
        <FinancialDashboard
          data={financialData}
          loading={financialDataLoading}
        />
      )}

      {/* Charts Section */}
      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Order Trends */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">Order Trends (7 Days)</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={orderTrendData}>
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stackId="1"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.3}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#FF8042"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">
            Top Products by Revenue
          </CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="horizontal">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>

      {/* Inventory Distribution */}
      {inventoryDistribution && (
        <CardContent>
          <InventoryDistributionDashboard
            data={inventoryDistribution}
            loading={inventoryLoading}
          />
        </CardContent>
      )}

      {/* Branch Performance & Recent Activities */}
      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Branch Performance */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">
            Branch Performance Metrics
          </CardTitle>
          <div className="space-y-4">
            {branchPerformance.map((branch, index) => (
              <div key={branch.branch} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{branch.branch}</span>
                  <Badge variant="outline" className="text-xs">
                    {branch.efficiency}% Efficiency
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Utilization</span>
                    <span>{branch.utilization}%</span>
                  </div>
                  <Progress value={branch.utilization} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Accuracy</span>
                    <span>{branch.accuracy}%</span>
                  </div>
                  <Progress value={branch.accuracy} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-4">
          <CardTitle className="mb-4 text-lg">Recent Activities</CardTitle>
          <div className="space-y-3">
            {recentActivities
              ?.slice(0, 8)
              .map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp} • {activity.user}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              )) || (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </Card>
      </CardContent>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <CardContent>
          <Card className="p-4">
            <CardTitle className="mb-4 text-lg">
              Performance Analytics
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Customer Satisfaction</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {performanceMetrics.customerSatisfaction || 94.2}%
                  </div>
                  <Progress
                    value={performanceMetrics.customerSatisfaction || 94.2}
                    className="h-2"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Order Fulfillment Rate</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {performanceMetrics.orderFulfillment || 96.8}%
                  </div>
                  <Progress
                    value={performanceMetrics.orderFulfillment || 96.8}
                    className="h-2"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Inventory Turnover</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {performanceMetrics.inventoryTurnover || 3.4}x
                  </div>
                  <div className="text-sm text-muted-foreground">Per year</div>
                </div>
              </div>
            </div>
          </Card>
        </CardContent>
      )}

      {/* Alerts Dashboard */}
      <CardContent>
        <AlertsDashboard alerts={alertsData || []} loading={alertsLoading} />
      </CardContent>
    </Card>
  );
};

export default OverviewDashboard;
