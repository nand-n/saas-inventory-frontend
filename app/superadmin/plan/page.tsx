// app/superadmin/plan/page.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plan, usePlan } from "@/store/plan/usePlan";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import PlanForm from "./_components/forms/PlanForm";

export default function PlanPage() {
  const { plans, fetchPlans, deletePlan } = usePlan();
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<Partial<Plan>>({});

  React.useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const columns = React.useMemo<ColumnDef<Plan>[]>(
    () => [
      {
        accessorKey: "plan_name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "currency",
        header: "Currency",
      },
      {
        accessorKey: "current_price",
        header: "Price",
        cell: (info) => info.getValue<number>().toFixed(2),
      },
      {
        accessorKey: "isFree",
        header: "Free",
        cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
      },
      {
        accessorKey: "duration",
        header: "Duration (days)",
      },
      {
        accessorKey: "days_left",
        header: "Days Left",
      },
      {
        accessorKey: "slug",
        header: "Slug",
      },
      {
        accessorKey: "recuring",
        header: "Recurring",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditId(String(p.id));
                  setEditData(p);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deletePlan(p.id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [deletePlan]
  );

  return (
    <div className=" min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Plans</h1>
          <Button
            onClick={() => {
              setEditId(null);
              setEditData({});
              setOpen(true);
            }}
          >
            + Add Plan
          </Button>
        </div>

        <TableWrapper<Plan> data={plans} columns={columns} title="Plans" />

        <PlanForm
          open={open}
          setOpen={setOpen}
          id={editId ?? undefined}
          defaultData={editData}
        />
      </main>
    </div>
  );
}
