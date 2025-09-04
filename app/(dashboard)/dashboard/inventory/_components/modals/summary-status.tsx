import React from "react";
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  summaryLoading: boolean;
  lowStockItems?: number;
  outOfStockItems?: number;
  averagePrice?: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalItems,
  totalQuantity,
  totalValue,
  summaryLoading,
  lowStockItems = 0,
  outOfStockItems = 0,
  averagePrice = 0,
}) => {
  const statCards = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Total Quantity",
      value: totalQuantity.toString(),
      icon: Layers,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Total Value",
      value: `${formatCurrency(totalValue)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Out of Stock",
      value: outOfStockItems.toString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      title: "Average Price",
      value: `${formatCurrency(averagePrice)}`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`hover:shadow-lg transition-all duration-200 border-l-4 ${stat.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="h-8 w-12 animate-pulse bg-gray-200 rounded" />
              ) : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SummaryCards;
