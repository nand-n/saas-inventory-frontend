"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useIndustry } from "@/store/Industry/useIndustry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IndustryFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedIndustry?: any;
}

export default function IndustryForm({
  open,
  setOpen,
  selectedIndustry = null,
}: IndustryFormProps) {
  const [name, setName] = React.useState(selectedIndustry?.name || "");
  const [description, setDescription] = React.useState(
    selectedIndustry?.description || ""
  );

  const { createIndustry, updateIndustry } = useIndustry();

  React.useEffect(() => {
    setName(selectedIndustry?.name || "");
    setDescription(selectedIndustry?.description || "");
  }, [selectedIndustry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndustry?.id) {
      await updateIndustry(selectedIndustry?.id, { name });
    } else {
      await createIndustry({ name, description });
    }
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow space-y-4">
          <Dialog.Title className="text-lg font-bold">
            {selectedIndustry?.id ? "Edit Industry" : "New Industry"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Industry Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
            <textarea
              rows={3}
              placeholder="Industry  Type Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
            <Button type="submit" className="w-full  text-white py-2 rounded">
              Save
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
