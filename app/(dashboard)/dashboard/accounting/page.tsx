"use client";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CoaTabs from "./_components/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { AccountCategory, ChartOfAccount } from "@/types/accounting.type";
import { Button } from "@/components/ui/button";
import AccountCategoryModal from "./_components/modals/account-category-modal";
import CoaModal from "./_components/modals/coa-modal";
import { Input } from "@/components/ui/input";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";

export default function AccountingPage() {
  const [searchCat, setSearchCat] = useState("");
  const [catPage, setCatPage] = useState(1);
  const [searchCoa, setSearchCoa] = useState("");
  const [coaPage, setCoaPage] = useState(1);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isCoaModalOpen, setIsCoaModalOpen] = useState(false);

  const [catForm, setCatForm] = useState<Partial<AccountCategory>>({
    code: "",
    name: "",
    description: "",
  });
  const [coaForm, setCoaForm] = useState<Partial<ChartOfAccount>>({
    code: "",
    name: "",
    categoryId: "",
  });

  const {
    data: categories = [],
    loading: catLoading,
    execute: fetchCats,
  } = useAsync(
    () =>
      axiosInstance.get("accounting/account-categories").then((r) => r.data),
    true
  );

  const {
    data: coas = [],
    loading: coaLoading,
    execute: fetchCoas,
  } = useAsync(
    () =>
      axiosInstance.get("/accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  useEffect(() => {
    fetchCats();
    fetchCoas();
  }, []);

  const handleCatSave = async () => {
    if (catForm.id)
      await axiosInstance.put(
        `/accounting/account-categories/${catForm.id}`,
        catForm
      );
    else await axiosInstance.post("/accounting/account-categories", catForm);
    setIsCatModalOpen(false);
    fetchCats();
  };
  const handleCoaSave = async () => {
    if (coaForm.id)
      await axiosInstance.put(
        `/accounting/chart-of-accounts/${coaForm.id}`,
        coaForm
      );
    else await axiosInstance.post("/accounting/chart-of-accounts", coaForm);
    setIsCoaModalOpen(false);
    fetchCoas();
  };

  const handleCatDelete = async (id: string) => {
    await axiosInstance.delete(`accounting/account-categories/${id}`);
    fetchCats();
  };
  const handleCoaDelete = async (id: string) => {
    await axiosInstance.delete(`/accounting/chart-of-accounts/${id}`);
    fetchCoas();
  };

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

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="border curs rounded-lg shadow-md p-4 space-y-3 bg-white">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h1 className="text-2xl font-bold">Account Categories</h1>
          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // prevent accordion toggle on button click
                setCatForm({});
                setIsCatModalOpen(true);
              }}
            >
              <PlusIcon className="h-5 w-5 mr-1" /> Add Category
            </Button>
            {isOpen ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        {isOpen && (
          <div className="space-y-4">
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
          </div>
        )}
      </div>
      {/* COA grouped by code ranges */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chart of Accounts</h2>
          <Button
            className="cursor-pointer"
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
    </>
  );
}
