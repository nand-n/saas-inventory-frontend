import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import Modal from "@/components/ui/commons/modalWrapper";
import { ChartOfAccount } from "@/types/accounting.type";
import { Checkbox } from "@/components/ui/checkbox";

type InventoryFormData = {
  item_name: string;
  sku: string;
  unit_price: number;
  unit_cost: number;
  reorder_level: number;
  category_id: string;
  quantity: number;
  branch_id: string;
  inventory_account_id: string;
  payment_account_id?: string;
};

interface InventoryItemModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: any | null;
  formData: InventoryFormData;
  setFormData: (data: InventoryFormData) => void;
  handleSave: () => void;
  handleGenerateSKU: () => void;
  setSelectedItem: (item: any | null) => void;
  inventoryCategories: Array<any>;
  branches: Array<any>;
  coas: ChartOfAccount[];
}

const InventoryItemModal: FC<InventoryItemModalProps> = ({
  isOpen,
  setIsOpen,
  selectedItem,
  formData,
  setFormData,
  handleSave,
  handleGenerateSKU,
  setSelectedItem,
  inventoryCategories,
  branches,
  coas,
}) => {
  const [isOnCredit, setIsOnCredit] = useState(false);
  return (
    <Modal
      size="lg"
      title={selectedItem ? "Edit Inventory Item" : "Add Inventory Item"}
      description={
        selectedItem
          ? "Update inventory item details"
          : "Create a new inventory item"
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setSelectedItem(null);
        setFormData({
          item_name: "",
          sku: "",
          unit_price: 0,
          unit_cost: 0,
          reorder_level: 0,
          category_id: "",
          quantity: 0,
          branch_id: "",
          inventory_account_id: "",
          payment_account_id: "",
        });
      }}
      onConfirm={handleSave}
      modalTrigger={<div />}
    >
      <div className="grid w-full h-full overflow-y-auto gap-4 py-4 px-1">
        <div className="flex justify-end  items-center gap-2">
          <span className="font-bold">Purchased on Credit</span>
          <Checkbox
            checked={isOnCredit}
            onClick={() => setIsOnCredit((val) => !val)}
            className="cursor-pointer"
            title="Purchase on Credit"
          />
        </div>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="Item Name"
              value={formData.item_name}
              onChange={(e) =>
                setFormData({ ...formData, item_name: e.target.value })
              }
              label="Item Name"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Unit Price"
              value={formData.unit_cost}
              onChange={(e) =>
                setFormData({ ...formData, unit_cost: Number(e.target.value) })
              }
              label="Unit Cost"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Unit Price"
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({ ...formData, unit_price: Number(e.target.value) })
              }
              label="Unit Price"
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Quantity"
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Reorder Level"
              type="number"
              placeholder="Reorder Level"
              value={formData.reorder_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reorder_level: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex  justify-between gap-2 items-center">
          <div className="space-y-2 gap-2 w-full">
            <label className="text-sm font-medium">Category</label>
            <Selector
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
              options={inventoryCategories?.map((category) => ({
                label: category.category_name,
                value: category.id,
              }))}
              placeholder="Select Category"
            />
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-medium">Branch</label>
            <Selector
              options={branches?.map((branch) => ({
                label: branch.name,
                value: branch.id,
              }))}
              placeholder="Select Branch"
              value={formData.branch_id}
              onValueChange={(value) =>
                setFormData({ ...formData, branch_id: value })
              }
            />
          </div>
        </div>

        <div className="flex  gap-2 items-center">
          <div className="space-y-2 w-full">
            <label className="text-sm font-medium">Inventory Account</label>
            <Selector
              options={coas
                ?.filter(
                  (coa) => Number(coa.code) < 4000 && Number(coa.code) >= 3000
                )
                .map((coa) => ({
                  label: coa.name,
                  value: coa.id,
                }))}
              placeholder="Select Inventory Account"
              value={formData.inventory_account_id}
              onValueChange={(value) =>
                setFormData({ ...formData, inventory_account_id: value })
              }
            />
          </div>
          {isOnCredit ? (
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Account Payable</label>
              <Selector
                options={coas
                  ?.filter(
                    (coa) => Number(coa.code) < 3000 && Number(coa.code) >= 2000
                  )
                  .map((coa) => ({
                    label: coa.name,
                    value: coa.id,
                  }))}
                placeholder="Select Account Payable"
                value={formData.payment_account_id || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_account_id: value })
                }
              />
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Cash Account</label>
              <Selector
                options={coas
                  ?.filter(
                    (coa) => Number(coa.code) < 2000 && Number(coa.code) >= 1000
                  )
                  .map((coa) => ({
                    label: coa.name,
                    value: coa.id,
                  }))}
                placeholder="Select Cash Account"
                value={formData.payment_account_id || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_account_id: value })
                }
              />
            </div>
          )}
        </div>
        <div className="space-y-2 grid items-center">
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
            <div className="grid">
              <label className="text-sm font-medium">SKU</label>

              <Input
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              {!selectedItem && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSKU}
                  disabled={!formData.category_id}
                >
                  Generate SKU
                </Button>
              )}
            </div>
            {formData.sku && (
              <div className="mt-2 flex flex-col items-center">
                <QRCode
                  value={formData.sku}
                  size={128}
                  className="border p-2 rounded-lg"
                />
                <span className="mt-2 text-xs text-muted-foreground">
                  SKU QR Code
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryItemModal;
