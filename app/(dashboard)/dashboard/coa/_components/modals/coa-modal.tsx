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
  normalBalance: "debit" | "credit";
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
      title={formData.id ? "Edit sub Account" : "Add sub Account"}
      description="Enter chart of account details"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setFormData({
          name: "",
          code: "",
          normalBalance: "debit",
          categoryId: "",
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
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.categoryId || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Normal Balance</label>
          <Select
            value={formData.normalBalance || "debit"}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                normalBalance: value as "debit" | "credit",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Balance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
