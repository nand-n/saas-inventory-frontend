'use client'

import Modal from "@/components/ui/commons/modalWrapper"
import { Input } from "@/components/ui/input"

type StockAdjustmentData = {
  item_id: string
  branch_id: string
  quantity: number
  reason: string
  approved_by_id: string
}

type StockAdjustmentModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  stockAdjustmentData: StockAdjustmentData
  setStockAdjustmentData: (data: StockAdjustmentData) => void
  handleStockAdjustment: (data: StockAdjustmentData) => void
  setSelectedItem: (item: any) => void
}

const StockAdjustmentModal = ({
  isOpen,
  setIsOpen,
  stockAdjustmentData,
  setStockAdjustmentData,
  handleStockAdjustment,
  setSelectedItem,
}: StockAdjustmentModalProps) => {
  return (
    <Modal
      title="Stock Adjustment"
      description="Adjust stock quantity with a reason"
      open={isOpen}
      onOpenChange={setIsOpen}
      onCancel={() => {
        setSelectedItem(null)
        setStockAdjustmentData({
          item_id: '',
          branch_id: '',
          quantity: 0,
          reason: '',
          approved_by_id: '',
        })
      }}
      onConfirm={() => handleStockAdjustment(stockAdjustmentData)}
      modalTrigger={<div />}
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            placeholder="Adjustment Quantity"
            value={stockAdjustmentData.quantity}
            onChange={(e) =>
              setStockAdjustmentData({ ...stockAdjustmentData, quantity: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>
          <Input
            placeholder="Reason"
            value={stockAdjustmentData.reason}
            onChange={(e) =>
              setStockAdjustmentData({ ...stockAdjustmentData, reason: e.target.value })
            }
          />
        </div>
      </div>
    </Modal>
  )
}

export default StockAdjustmentModal
