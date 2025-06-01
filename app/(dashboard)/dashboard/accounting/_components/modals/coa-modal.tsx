"use client";

import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChartOfAccount = {
  id?: string;
  name: string;
  code: string;
  description?: string;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

type CoaModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: Partial<ChartOfAccount>;
  setFormData: (data: Partial<ChartOfAccount>) => void;
  onSave: () => void;
  categories: Category[];
};

export default function CoaModal({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  onSave,
  categories = [],
}: CoaModalProps) {
  return (
    <Modal
      title={formData.id ? "Edit Chart of Account" : "Add Chart of Account"}
      description="Enter chart of account details"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setFormData({
          name: "",
          code: "",
          categoryId: "",
          description: "",
        });
      }}
      onConfirm={onSave}
      modalTrigger={<div />}
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Account Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Code</label>
          <Input
            placeholder="Account Code"
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.categoryId || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem
                  className="cursor-pointer"
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
