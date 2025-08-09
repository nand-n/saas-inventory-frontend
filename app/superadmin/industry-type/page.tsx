"use client";

import { useIndustry } from "@/store/Industry/useIndustry";
import * as React from "react";
import IndustryForm from "./_components/forms/IndustryForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function IndustryPage() {
  const { industries, fetchIndustries, deleteIndustry } = useIndustry();
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [selectedIndustry, setSelectedIndustry] = React.useState<any>(null);

  React.useEffect(() => {
    fetchIndustries();
  }, []);

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Industry Types</h1>
        <Button
          onClick={() => {
            setEditId(null);
            setEditName("");
            setOpen(true);
          }}
          className=" text-white px-4 py-2 rounded"
        >
          + Add Industry
        </Button>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-left p-3">Name</TableHead>
              <TableHead className="text-left p-3">Description</TableHead>
              <TableHead className="text-center p-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.length > 0 ? (
              industries.map((industry) => (
                <TableRow
                  key={industry.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="p-3 font-medium">
                    {industry.name}
                  </TableCell>
                  <TableCell className="p-3 text-gray-700">
                    {industry.description}
                  </TableCell>
                  <TableCell className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedIndustry(industry);
                        setOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteIndustry(industry.id ?? "")}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="p-4 text-center text-gray-500"
                >
                  No industry types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <IndustryForm
        open={open}
        setOpen={setOpen}
        selectedIndustry={selectedIndustry}
      />
    </main>
  );
}
