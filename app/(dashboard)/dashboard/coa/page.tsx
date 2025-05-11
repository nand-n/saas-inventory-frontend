"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import AccountCategoryModal from "./_components/modals/account-category-modal";
import CoaModal from "./_components/modals/coa-modal";
import CoaTabs from "./_components/tabs";

interface AccountCategory {
  id: string;
  name: string;
  code: string;
  normalBalance: "debit" | "credit";
}

export type ChartOfAccount = {
  id?: string;
  name: string;
  code: string;
  normalBalance: "debit" | "credit";
  categoryId: string;
};

const coaGroups = [
  { label: "Assets", range: [1000, 1999] },
  { label: "Liabilities", range: [2000, 2999] },
  { label: "Equity", range: [3000, 3999] },
  { label: "Revenue", range: [4000, 4999] },
  { label: "Expenses", range: [5000, 5999] },
];

export default function CoaPage() {
  const [searchCat, setSearchCat] = useState("");
  const [catPage, setCatPage] = useState(1);
  const [searchCoa, setSearchCoa] = useState("");
  const [coaPage, setCoaPage] = useState(1);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isCoaModalOpen, setIsCoaModalOpen] = useState(false);
  const [catForm, setCatForm] = useState<Partial<AccountCategory>>({
    code: "",
    name: "",
    normalBalance: "debit",
  });
  const [coaForm, setCoaForm] = useState<Partial<ChartOfAccount>>({
    code: "",
    // name: "",
    normalBalance: "debit",
    categoryId: "",
  });

  const {
    data: categories = [],
    loading: catLoading,
    execute: fetchCats,
  } = useAsync(
    () => axiosInstance.get("/account-categories").then((r) => r.data),
    true
  );

  const {
    data: coas = [],
    loading: coaLoading,
    execute: fetchCoas,
  } = useAsync(() => axiosInstance.get("/coa").then((r) => r.data), true);

  useEffect(() => {
    fetchCats();
    fetchCoas();
  }, []);

  const filteredCats = useMemo(
    () =>
      categories?.filter((c: { name: string }) =>
        c.name.toLowerCase().includes(searchCat.toLowerCase())
      ) ?? [],
    [categories, searchCat]
  );

  const paginatedCats = useMemo(() => {
    const start = (catPage - 1) * 5;
    return filteredCats.slice(start, start + 5);
  }, [filteredCats, catPage]);

  const filteredCoas = useMemo(
    () =>
      coas?.filter((a: { name: string }) =>
        a?.name.toLowerCase().includes(searchCoa.toLowerCase())
      ) ?? [],
    [coas, searchCoa]
  );

  const paginatedCoas = useMemo(() => {
    const start = (coaPage - 1) * 10;
    return filteredCoas.slice(start, start + 10);
  }, [filteredCoas, coaPage]);

  const groupedCoas = useMemo(() => {
    const groups: Record<string, ChartOfAccount[]> = {};
    coaGroups.forEach((g) => {
      groups[g.label] = [];
    });
    filteredCoas.forEach((coa: ChartOfAccount) => {
      const codeNum = parseInt(coa.code, 10);
      const grp = coaGroups.find(
        (g) => codeNum >= g.range[0] && codeNum <= g.range[1]
      );
      if (grp) groups[grp.label].push(coa);
    });
    return groups;
  }, [filteredCoas]);

  const handleCatSave = async () => {
    if (catForm.id)
      await axiosInstance.put(`/account-categories/${catForm.id}`, catForm);
    else await axiosInstance.post("/account-categories", catForm);
    setIsCatModalOpen(false);
    fetchCats();
  };

  const handleCoaSave = async () => {
    await axiosInstance.post("/coa", coaForm);
    setIsCoaModalOpen(false);
    fetchCoas();
  };

  const handleCatDelete = async (id: string) => {
    await axiosInstance.delete(`/account-categories/${id}`);
    fetchCats();
  };

  const handleCoaDelete = async (id: string) => {
    await axiosInstance.delete(`/coa/${id}`);
    fetchCoas();
  };

  const catColumns: ColumnDef<AccountCategory>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "normalBalance", header: "Balance" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCatForm(cat);
                setIsCatModalOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCatDelete(cat.id)}
            >
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const coaColumns: ColumnDef<ChartOfAccount>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "normalBalance", header: "Balance" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const acc = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCoaForm(acc);
                setIsCoaModalOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCoaDelete(acc.id ?? "")}
            >
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Management */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Categories</h1>
        <Button
          onClick={() => {
            setCatForm({});
            setIsCatModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-1" /> Add Category
        </Button>
      </div>
      <Input
        placeholder="Search categories..."
        value={searchCat}
        onChange={(e) => setSearchCat(e.target.value)}
      />
      <TableWrapper<AccountCategory>
        columns={catColumns}
        data={paginatedCats}
        loading={catLoading}
        title="Categories"
      />

      {/* COA grouped by code ranges */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chart of Accounts</h2>
          <Button
            onClick={() => {
              setCoaForm({});
              setIsCoaModalOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add COA
          </Button>
        </div>
        <CoaTabs columns={coaColumns} coas={coas} loading={coaLoading} />
      </div>

      <AccountCategoryModal
        isOpen={isCatModalOpen}
        formData={catForm}
        setFormData={setCatForm}
        onSave={handleCatSave}
        setIsOpen={() => setIsCatModalOpen(false)}
      />

      <CoaModal
        isOpen={isCoaModalOpen}
        categories={categories || []}
        setIsOpen={setIsCoaModalOpen}
        formData={coaForm}
        setFormData={setCoaForm}
        onSave={handleCoaSave}
      />
    </div>
  );
}
