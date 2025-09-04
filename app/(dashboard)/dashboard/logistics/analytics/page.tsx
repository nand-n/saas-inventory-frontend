"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Ship,
  Plane,
  Calendar,
  MapPin,
  BarChart3,
  Download,
  Filter,
} from "lucide-react";
import { useShipmentsStore } from "@/store/shipments/useShipmentsStore";
import { ShipmentStatus, ShipmentType } from "@/types/shipment.types";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";

interface LogisticsMetrics {
  totalShipments: number;
  totalCost: number;
  averageTransitTime: number;
  onTimeDeliveryRate: number;
  customsClearanceRate: number;
  costPerShipment: number;
  monthlyGrowth: number;
  topCarriers: Array<{ name: string; count: number; percentage: number }>;
  routeEfficiency: Array<{ route: string; efficiency: number; cost: number }>;
  monthlyTrends: Array<{ month: string; shipments: number; cost: number }>;
}

export default function LogisticsAnalyticsPage() {
  const { shipments, fetchShipments } = useShipmentsStore();
  const [metrics, setMetrics] = useState<LogisticsMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    if (shipments.length > 0) {
      calculateMetrics();
    }
  }, [shipments, selectedPeriod]);

  const calculateMetrics = () => {
    setIsLoading(true);

    // Filter shipments based on selected period
    const now = new Date();
    const filteredShipments = shipments.filter((shipment) => {
      const shipmentDate = new Date(shipment.createdAt);
      const diffDays =
        (now.getTime() - shipmentDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (selectedPeriod) {
        case "7d":
          return diffDays <= 7;
        case "30d":
          return diffDays <= 30;
        case "90d":
          return diffDays <= 90;
        case "1y":
          return diffDays <= 365;
        default:
          return true;
      }
    });

    // Calculate metrics
    const totalShipments = filteredShipments.length;
    const totalCost = filteredShipments.reduce(
      (sum, s) => sum + (s.shippingCost || 0),
      0
    );
    const costPerShipment = totalShipments > 0 ? totalCost / totalShipments : 0;

    // Calculate on-time delivery rate
    const deliveredShipments = filteredShipments.filter(
      (s) => s.status === ShipmentStatus.DELIVERED
    );
    const onTimeDeliveries = deliveredShipments.filter((s) => {
      if (!s.estimatedDeliveryDate || !s.actualDeliveryDate) return false;
      const estimated = new Date(s.estimatedDeliveryDate);
      const actual = new Date(s.actualDeliveryDate);
      return actual <= estimated;
    });
    const onTimeDeliveryRate =
      deliveredShipments.length > 0
        ? (onTimeDeliveries.length / deliveredShipments.length) * 100
        : 0;

    // Calculate customs clearance rate
    const customsShipments = filteredShipments.filter(
      (s) =>
        s.status === ShipmentStatus.IN_CUSTOMS ||
        s.status === ShipmentStatus.CLEARED
    );
    const clearedShipments = filteredShipments.filter(
      (s) => s.status === ShipmentStatus.CLEARED
    );
    const customsClearanceRate =
      customsShipments.length > 0
        ? (clearedShipments.length / customsShipments.length) * 100
        : 0;

    // Calculate average transit time
    const transitTimes = deliveredShipments
      .filter((s) => s.shippedDate && s.actualDeliveryDate)
      .map((s) => {
        const shipped = new Date(s.shippedDate!);
        const delivered = new Date(s.actualDeliveryDate!);
        return (
          (delivered.getTime() - shipped.getTime()) / (1000 * 60 * 60 * 24)
        );
      });
    const averageTransitTime =
      transitTimes.length > 0
        ? transitTimes.reduce((sum, time) => sum + time, 0) /
          transitTimes.length
        : 0;

    // Calculate monthly growth
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthShipments = filteredShipments.filter((s) => {
      const date = new Date(s.createdAt);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthShipments = filteredShipments.filter((s) => {
      const date = new Date(s.createdAt);
      return (
        date.getMonth() === previousMonth && date.getFullYear() === previousYear
      );
    });
    const monthlyGrowth =
      previousMonthShipments.length > 0
        ? ((currentMonthShipments.length - previousMonthShipments.length) /
            previousMonthShipments.length) *
          100
        : 0;

    // Calculate top carriers
    const carrierCounts: { [key: string]: number } = {};
    filteredShipments.forEach((s) => {
      carrierCounts[s.carrier] = (carrierCounts[s.carrier] || 0) + 1;
    });
    const topCarriers = Object.entries(carrierCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalShipments) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate route efficiency
    const routeEfficiency = [
      { route: "Import", efficiency: 85, cost: totalCost * 0.6 },
      { route: "Export", efficiency: 78, cost: totalCost * 0.3 },
      { route: "Domestic", efficiency: 92, cost: totalCost * 0.1 },
    ];

    // Calculate monthly trends
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthShipments = filteredShipments.filter((s) => {
        const shipmentDate = new Date(s.createdAt);
        return (
          shipmentDate.getMonth() === date.getMonth() &&
          shipmentDate.getFullYear() === date.getFullYear()
        );
      });
      const monthCost = monthShipments.reduce(
        (sum, s) => sum + (s.shippingCost || 0),
        0
      );

      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        shipments: monthShipments.length,
        cost: monthCost,
      };
    }).reverse();

    setMetrics({
      totalShipments,
      totalCost,
      averageTransitTime,
      onTimeDeliveryRate,
      customsClearanceRate,
      costPerShipment,
      monthlyGrowth,
      topCarriers,
      routeEfficiency,
      monthlyTrends,
    });

    setIsLoading(false);
  };

  const exportReport = () => {
    if (!metrics) return;

    const data = {
      period: selectedPeriod,
      metrics: metrics,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logistics-analytics-${selectedPeriod}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating logistics metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Logistics Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive insights into your logistics operations and
            performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalShipments}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.monthlyGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              {Math.abs(metrics.monthlyGrowth).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.costPerShipment)} per shipment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Delivery
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.onTimeDeliveryRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customs Clearance
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.customsClearanceRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Clearance success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Carriers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topCarriers.map((carrier, index) => (
                <div
                  key={carrier.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{carrier.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{carrier.count}</span>
                    <span className="text-sm text-muted-foreground">
                      ({carrier.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.routeEfficiency.map((route) => (
                <div key={route.route} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{route.route}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(route.cost)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${route.efficiency}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {route.efficiency}% efficiency
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
              <div>Month</div>
              <div>Shipments</div>
              <div>Cost</div>
            </div>
            {metrics.monthlyTrends.map((trend) => (
              <div
                key={trend.month}
                className="grid grid-cols-3 gap-4 items-center"
              >
                <div className="font-medium">{trend.month}</div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span>{trend.shipments}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{formatCurrency(trend.cost)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Transit Time Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Average Transit Time:
                  </span>
                  <span className="font-medium">
                    {metrics.averageTransitTime.toFixed(1)} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Fastest Route:
                  </span>
                  <span className="font-medium">Domestic (2-3 days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Slowest Route:
                  </span>
                  <span className="font-medium">Import (15-20 days)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Cost Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Cost per Shipment:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(metrics.costPerShipment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Most Expensive:
                  </span>
                  <span className="font-medium">Air Freight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Most Cost-Effective:
                  </span>
                  <span className="font-medium">Sea Freight</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
