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
  console.log(formData, "formData");
  return (
    <Modal
      title={formData.id ? "Edit Category" : "Add Category"}
      description="Enter account category details"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setFormData({ name: "", code: "", description: "" });
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
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="Description"
            value={formData.code ?? ""}
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
