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

type AccountCategory = {
  id?: string;
  name: string;
  code: string;
  normalBalance: "debit" | "credit";
};

type AccountCategoryModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: Partial<AccountCategory>;
  setFormData: (data: Partial<AccountCategory>) => void;
  onSave: () => void;
};

const AccountCategoryModal = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  onSave,
}: AccountCategoryModalProps) => {
  console.log(formData, "formData");
  return (
    <Modal
      title={formData.id ? "Edit Category" : "Add Category"}
      description="Enter account category details"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setFormData({ name: "", code: "", normalBalance: "debit" });
      }}
      onConfirm={onSave}
      modalTrigger={<div />}
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Category Name"
            value={formData.name ?? ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Code</label>
          <Input
            placeholder="Category Code"
            value={formData.code ?? ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Normal Balance</label>
          <Select
            value={formData.normalBalance ?? "debit"}
            onValueChange={(value) => {
              setFormData({
                ...formData,
                normalBalance: value as "debit" | "credit",
              });
            }}
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
};

export default AccountCategoryModal;
