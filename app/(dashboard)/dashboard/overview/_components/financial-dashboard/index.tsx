"use client";

import React, { useEffect, useState } from "react";
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
} from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { useAsync } from "@/hooks/useAsync";

const COLORS = ["#4F46E5", "#FF8042", "#FFBB28", "#00C49F", "#8884d8"];

const FinancialDashboard = ({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) => {
  if (loading) {
    return <div className="p-4">Loading financial data...</div>;
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

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle className="mb-4 mx-2 md:mx-4">Financial Overview</CardTitle>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm w-full text-muted-foreground">Total Debit</p>
            <p className="text-xl font-semibold mt-2">{data.totalDebit}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Credit</p>
            <p className="text-xl font-semibold mt-2">{data.totalCredit}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className="text-xl font-semibold mt-2">
              {data.profitAndLoss.netIncome}
            </p>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4">Categories Debit vs Credit</CardTitle>
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

      <Card>
        <CardContent className="p-4">
          <CardTitle className="mb-4">Profit & Loss Breakdown</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
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
          <CardTitle className="mb-4">Cash Flow Summary</CardTitle>
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
  );
};

export default FinancialDashboard;
