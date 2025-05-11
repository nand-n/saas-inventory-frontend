import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';
import Modal from '@/components/ui/commons/modalWrapper';

type InventoryFormData = {
  item_name: string;
  sku: string;
  unit_price: number;
  reorder_level: number;
  category_id: string;
  quantity: number;
  branch_id: string;
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
}) => {
  return (
    <Modal
      title={selectedItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
      description={selectedItem ? 'Update inventory item details' : 'Create a new inventory item'}
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setSelectedItem(null);
        setFormData({ item_name: '', sku: '', unit_price: 0, reorder_level: 0, category_id: '', quantity: 0, branch_id: '' });
      }}
      onConfirm={handleSave}
      modalTrigger={<div />}
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Item Name</label>
          <Input
            placeholder="Item Name"
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
          />
        </div>



        <div className="space-y-2">
          <label className="text-sm font-medium">Unit Price</label>
          <Input
            type="number"
            placeholder="Unit Price"
            value={formData.unit_price}
            onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reorder Level</label>
          <Input
            type="number"
            placeholder="Reorder Level"
            value={formData.reorder_level}
            onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
          />
        </div>

        <div className="flex justify-between items-center">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {inventoryCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Branch</label>
          <Select
            value={formData.branch_id}
            onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
        <div className="space-y-2">
          
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
          <div className="grid">
            <label className="text-sm font-medium">SKU</label>
            
            <Input
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
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
