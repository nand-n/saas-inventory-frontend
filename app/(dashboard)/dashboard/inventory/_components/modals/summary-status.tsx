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
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group"
          >
            {/* Left border accent line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.bgColor.replace("bg-", "bg-").replace("100", "400").replace("900/30", "500")}`} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 pl-5">
              <CardTitle className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bgColor} ring-1 ring-white/50 dark:ring-gray-800 transition-transform group-hover:scale-110 duration-300`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pl-5 pb-5">
              {summaryLoading ? (
                <div className="h-8 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md mt-1" />
              ) : (
                <div className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-1">
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
