// components/StockTransferModal.tsx
'use client'

import Modal from "@/components/ui/commons/modalWrapper"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StockTransferData = {
  source_branch_id: string
  destination_branch_id: string
  item_id: string
  quantity: number
  status: string
}

type Branch = {
  id: string
  name: string
}

type StockTransferModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  stockTransferData: StockTransferData
  setStockTransferData: (data: StockTransferData) => void
  handleStockTransfer: (data: StockTransferData) => void
  setSelectedItem: (item: any) => void
  branches: Branch[]
}

const StockTransferModal = ({
  isOpen,
  setIsOpen,
  stockTransferData,
  setStockTransferData,
  handleStockTransfer,
  setSelectedItem,
  branches,
}: StockTransferModalProps) => {
  return (
    <Modal
      title="Stock Transfer"
      description="Transfer stock to another branch"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setSelectedItem(null)
        setStockTransferData({
          source_branch_id: '',
          destination_branch_id: '',
          item_id: '',
          quantity: 0,
          status: 'Pending',
        })
      }}
      onConfirm={() => handleStockTransfer(stockTransferData)}
      modalTrigger={<div />}
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            placeholder="Transfer Quantity"
            value={stockTransferData.quantity}
            onChange={(e) =>
              setStockTransferData({ ...stockTransferData, quantity: Number(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Branch</label>
          <Select
            value={stockTransferData.destination_branch_id}
            onValueChange={(value) =>
              setStockTransferData({ ...stockTransferData, destination_branch_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.map((branch: Branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  )
}

export default StockTransferModal
