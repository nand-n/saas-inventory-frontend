import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { InventoryItem } from "@/types/inventory";

interface ItemListProps {
  items: InventoryItem[];
  handleSell: (item: InventoryItem) => void;
}

const ItemList = ({ items, handleSell }: ItemListProps) => {
  const [quantities, setQuantities] = useState<Record<string | number, number>>(
    {}
  );

  console.log(quantities[items[2].id], " quantities");
  const handleIncrease = (item: InventoryItem) => {
    setQuantities((prev) => {
      const current = prev[item.id] || 0;
      if (current < item.quantity) {
        return { ...prev, [item.id]: current + 1 };
      }
      return prev;
    });
  };

  const handleDecrease = (item: InventoryItem) => {
    setQuantities((prev) => {
      const current = prev[item.id] || 0;
      if (current > 0) {
        return { ...prev, [item.id]: current - 1 };
      }
      return prev;
    });
  };

  const handleInputChange = (item: InventoryItem, value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= item.quantity) {
      setQuantities((prev) => ({ ...prev, [item.id]: parsed }));
    }
  };

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} className="p-4 flex flex-col justify-between gap-2">
          <div>
            <h3 className="font-medium">{item.item_name}</h3>
            <p className="text-sm text-gray-500">${item.unit_price}</p>
            <p className="text-xs text-muted-foreground">
              Stock: {item.quantity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDecrease(item)}
              disabled={(quantities[item.id] || 0) <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              min={0}
              max={item.quantity}
              value={quantities[item.id] || 0}
              onChange={(e) => handleInputChange(item, e.target.value)}
              className="w-16 text-center"
            />

            <Button
              size="icon"
              variant="outline"
              onClick={() => handleIncrease(item)}
              disabled={(quantities[item.id] || 0) >= item.quantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            size="sm"
            className="w-full"
            onClick={() => handleSell(item)}
            disabled={item.quantity === 0 || (quantities[item.id] || 0) === 0}
          >
            {item.quantity > 0 ? "Sell" : "Out of Stock"}
          </Button>
        </Card>
      ))}
    </>
  );
};

export default ItemList;
