// app/superadmin/payment-method/page.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { usePaymentMethod } from "@/store/payment-method/usePaymentMethod";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import PaymentMethodForm from "./_components/forms/PaymentMethodForm";

export default function PaymentMethodPage() {
  const { methods, fetchMethods, deleteMethod } = usePaymentMethod();
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<Partial<(typeof methods)[0]>>(
    {}
  );

  React.useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const columns = React.useMemo<ColumnDef<(typeof methods)[0]>[]>(
    () => [
      {
        accessorKey: "payment_method",
        header: "Method",
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "currency",
        header: "Currency",
      },
      {
        accessorKey: "currencyCode",
        header: "Code",
      },
      {
        accessorKey: "card_number",
        header: "Card #",
        cell: (info) => info.getValue<string>() || "—",
      },
      {
        accessorKey: "isFree",
        header: "Free",
        cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
        cell: (info) => info.getValue<string>() || "—",
      },
      {
        accessorKey: "planId",
        header: "Plan",
        cell: (info) => info.getValue<string>() || "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditId(String(m.id));
                  setEditData(m);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMethod(m.id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMethod]
  );

  return (
    <div className=" min-h-screen">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button
          onClick={() => {
            setEditId(null);
            setEditData({});
            setOpen(true);
          }}
        >
          + Add Method
        </Button>
      </div>

      <TableWrapper
        data={methods}
        columns={columns}
        title="Payment Method Lists"
      />

      <PaymentMethodForm
        open={open}
        setOpen={setOpen}
        id={editId ?? undefined}
        defaultData={editData}
      />
    </div>
  );
}
