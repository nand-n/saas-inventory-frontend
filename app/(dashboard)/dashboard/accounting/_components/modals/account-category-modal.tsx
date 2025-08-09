"use client";

import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import { AccountCategory } from "@/types/accounting.type";

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
  return (
    <Modal
      title={formData.id ? "Edit Category" : "Add Category"}
      description="Enter account category details"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setFormData({ name: "", code: "", description: "" });
        setIsOpen(false);
      }}
      onConfirm={onSave}
    >
      <div className="grid gap-4 py-4 px-1">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Category Name"
            value={formData.name ?? ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Category Code"
            label="Category Code"
            value={formData.code ?? ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={formData.description ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default AccountCategoryModal;
