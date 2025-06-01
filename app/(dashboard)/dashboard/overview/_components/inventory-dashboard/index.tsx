import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryDistributionDashboardProps {
  data: {
    branch: string;
    stock: number;
    lowStock: number;
    outOfStock: number;
  }[];
  loading: boolean;
}

export const InventoryDistributionDashboard = ({
  data,
  loading,
}: InventoryDistributionDashboardProps) => {
  if (loading) return <div>Loading inventory data...</div>;

  return (
    <CardContent className="w-full grid grid-cols-1 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">
          Inventory Distribution by Branch
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" stackId="a" fill="#4F46E5" />
            <Bar dataKey="lowStock" stackId="a" fill="#FFBB28" />
            <Bar dataKey="outOfStock" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </CardContent>
  );
};
