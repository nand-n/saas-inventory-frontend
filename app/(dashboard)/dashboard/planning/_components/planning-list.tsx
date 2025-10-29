
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { Planning } from "@/types/planning.type";

interface PlanningListProps {
  plannings: Planning[];
  isLoading: boolean;
  onView: (planning: Planning) => void;
  onCreate?: () => void;
}

export function PlanningList({ plannings, isLoading, onView, onCreate }: PlanningListProps) {
  // ----------------------------
  // LOADING STATE (Skeletons)
  // ----------------------------
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </Card>
        ))}
      </div>
    );
  }

  // ----------------------------
  // EMPTY STATE
  // ----------------------------
  if (!isLoading && (!plannings || plannings.length === 0)) {
    return (
      <Card className="p-12 text-center border-dashed border-muted-foreground/30">
        <p className="text-muted-foreground mb-4 text-base">No planning records yet</p>
        <Button onClick={onCreate} variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Plan
        </Button>
      </Card>
    );
  }

  // ----------------------------
  // MAIN LIST
  // ----------------------------
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {plannings.map((planning) => (
          <Card
            key={planning.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onView(planning)}
          >
            <div className="flex items-start justify-between">
              {/* Left Side */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{planning.name}</h3>
                  <StatusBadge status={planning.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Monthly Demand</p>
                    <p className="font-medium">
                      {planning.forecastMonthlyDemand?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-medium">
                      {planning.currentOnHand?.toLocaleString() ?? "—"}
                    </p>
                  </div>

                  {planning.decidedOrderQuantity ? (
                    <div>
                      <p className="text-muted-foreground">Order Quantity</p>
                      <p className="font-medium text-primary">
                        {planning.decidedOrderQuantity.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">Order Quantity</p>
                      <p className="font-medium text-muted-foreground/70">Not decided</p>
                    </div>
                  )}

                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {planning.createdAt
                        ? format(new Date(planning.createdAt), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering card click
                  onView(planning);
                }}
                variant="ghost"
                size="icon"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
