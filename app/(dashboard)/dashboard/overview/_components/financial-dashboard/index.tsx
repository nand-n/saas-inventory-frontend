"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Receipt,
  Calculator,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "#4F46E5",
  "#FF8042",
  "#FFBB28",
  "#00C49F",
  "#8884d8",
  "#10B981",
];

const FinancialDashboard = ({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  const categoryChartData =
    Object.entries(data?.categories)?.map(([category, values]: any) => ({
      name: category,
      Debit: values.debit,
      Credit: values.credit,
    })) ?? [];

  const pieData = [
    { name: "Revenue", value: data.profitAndLoss.revenue },
    { name: "Expenses", value: data.profitAndLoss.expenses },
    { name: "Net Income", value: data.profitAndLoss.netIncome },
  ];

  const cashFlowData = Object.entries(data.cashFlow).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  // Mock data for additional charts (replace with real data when available)
  const monthlyRevenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 38000, profit: 14000 },
    { month: "Mar", revenue: 48000, expenses: 35000, profit: 13000 },
    { month: "Apr", revenue: 61000, expenses: 42000, profit: 19000 },
    { month: "May", revenue: 55000, expenses: 39000, profit: 16000 },
    { month: "Jun", revenue: 67000, expenses: 45000, profit: 22000 },
  ];

  const accountBalances = [
    { account: "Cash", balance: 125000, type: "asset" },
    { account: "Accounts Receivable", balance: 85000, type: "asset" },
    { account: "Inventory", balance: 150000, type: "asset" },
    { account: "Accounts Payable", balance: 95000, type: "liability" },
    { account: "Loans", balance: 200000, type: "liability" },
    { account: "Equity", balance: 65000, type: "equity" },
  ];

  // Calculate financial ratios
  const currentRatio = (data.totalAssets || 0) / (data.totalLiabilities || 1);
  const profitMargin =
    data.profitAndLoss.revenue > 0
      ? (data.profitAndLoss.netIncome / data.profitAndLoss.revenue) * 100
      : 0;
  const debtToEquity = (data.totalLiabilities || 0) / (data.totalEquity || 1);

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <Card>
        <CardTitle className="mb-4 mx-2 md:mx-4 text-lg">
          Financial Overview
        </CardTitle>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debit</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(data.totalDebit || 0)}
                </p>
              </div>
              <Receipt className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+8.2%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credit</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(data.totalCredit || 0)}
                </p>
              </div>
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(data.profitAndLoss?.netIncome || 0)}
                </p>
              </div>
              <PiggyBank className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+15.3%</span>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-xl font-bold text-orange-600">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <Calculator className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+2.1%</span>
            </div>
          </Card>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4 text-lg">Financial Ratios</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Current Ratio</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {currentRatio.toFixed(2)}
              </div>
              <Progress
                value={Math.min(currentRatio * 20, 100)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {currentRatio > 1.5
                  ? "Excellent"
                  : currentRatio > 1
                  ? "Good"
                  : "Needs Attention"}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Profit Margin</h4>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {profitMargin.toFixed(1)}%
              </div>
              <Progress value={Math.min(profitMargin, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {profitMargin > 15
                  ? "Excellent"
                  : profitMargin > 10
                  ? "Good"
                  : "Needs Improvement"}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Debt to Equity</h4>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {debtToEquity.toFixed(2)}
              </div>
              <Progress
                value={Math.min(debtToEquity * 25, 100)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {debtToEquity < 0.5
                  ? "Excellent"
                  : debtToEquity < 1
                  ? "Good"
                  : "High Risk"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Trends */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4 text-lg">Monthly Revenue Trends</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.3}
                name="Revenue"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="expenses"
                stackId="1"
                stroke="#FF8042"
                fill="#FF8042"
                fillOpacity={0.3}
                name="Expenses"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                strokeWidth={3}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Categories Debit vs Credit */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4 text-lg">
            Categories Debit vs Credit
          </CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Debit" fill="#4F46E5" />
              <Bar dataKey="Credit" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profit & Loss and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <CardTitle className="mb-4 text-lg">
              Profit & Loss Breakdown
            </CardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${percent.toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <CardTitle className="mb-4 text-lg">Cash Flow Summary</CardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Account Balances */}
      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4 text-lg">Account Balances</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountBalances.map((account, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{account.account}</p>
                    <p
                      className={`text-lg font-bold ${
                        account.type === "asset"
                          ? "text-green-600"
                          : account.type === "liability"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      account.type === "asset"
                        ? "default"
                        : account.type === "liability"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {account.type}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
