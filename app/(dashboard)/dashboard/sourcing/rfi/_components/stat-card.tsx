import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass?: string;
}

export default function StatsCard({ title, value, icon: Icon, colorClass = "text-primary" }: StatsCardProps) {
  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-muted ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
