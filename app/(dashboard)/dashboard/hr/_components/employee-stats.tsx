import React from "react";

import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Building,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeeStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    terminated: number;
    averageSalary: number;
    totalSalary: number;
    newHiresThisMonth: number;
  };
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Employees",
      value: stats.total.toString(),
      change: `+${stats.newHiresThisMonth} this month`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Active Employees",
      value: stats.active.toString(),
      change: `${
        stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0
      }% of total`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Average Salary",
      value: formatCurrency(stats.averageSalary),
      change: "Across all employees",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
   {
      title: "Total Payroll",
      value: formatCurrency(stats.totalSalary, "ETB"),
      change: "Total monthly payout",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ];

  console.log(stats ,"stats")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EmployeeStats;
