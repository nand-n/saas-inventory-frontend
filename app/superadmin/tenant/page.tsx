"use client";

import * as React from "react";
import { useTenant } from "@/store/tenant/useTenant";
import { ColumnDef } from "@tanstack/react-table";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import TenantForm from "./_components/forms/TenantForm";
import { Button } from "@/components/ui/button";
import { useIndustry } from "@/store/Industry/useIndustry";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TenantPage() {
  const { tenants, fetchTenants, deleteTenant } = useTenant();
  const { industries, fetchIndustries } = useIndustry();
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<any>({});

  React.useEffect(() => {
    fetchTenants();
    fetchIndustries();
  }, []);

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "industryType",
      header: "Industry",
      cell: ({ row }) => {
        return row.original.industryType?.name || "N/A";
      },
    },
    { accessorKey: "numberOfBranches", header: "Branches" },
    { accessorKey: "contactEmail", header: "Admin Email" },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            className="bg-yellow-500 text-white px-3 py-1 rounded"
            onClick={() => {
              setEditId(row.original.id);
              setEditData(row.original);
              setOpen(true);
            }}
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => deleteTenant(row.original.id)}
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className=" min-h-screen">
      <main className="flex-1 p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Tenants</h1>
          <Button
            onClick={() => {
              setEditId(null);
              setEditData({});
              setOpen(true);
            }}
            className=" text-white px-4 py-2 rounded"
          >
            + Add Tenant
          </Button>
        </div>

        <TableWrapper data={tenants} columns={columns} title="Tenant List" />

        <TenantForm
          open={open}
          setOpen={setOpen}
          id={editId ?? undefined}
          defaultData={editData}
          industries={industries}
        />
      </main>
    </div>
  );
}
