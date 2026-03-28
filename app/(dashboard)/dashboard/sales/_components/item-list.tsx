"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, MinusIcon, ShoppingBagIcon, CubeIcon } from "@heroicons/react/24/outline";
import { InventoryItem } from "@/types/inventory";
import useConfigurationStore from "@/store/tenant/configurationStore";
import { Badge } from "@/components/ui/badge";

interface ItemListProps {
  items: InventoryItem[];
  updateCart: (item: InventoryItem, quantity: number) => void;
}

const ItemList = ({ items, updateCart }: ItemListProps) => {
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});
  const { paymentConfiguration } = useConfigurationStore();

  const handleIncrease = (item: InventoryItem) => {
    setQuantities((prev) => {
      const current = prev[item.id] ?? 1;
      if (current < item.quantity) {
        return { ...prev, [item.id]: current + 1 };
      }
      return prev;
    });
  };

  const handleDecrease = (item: InventoryItem) => {
    setQuantities((prev) => {
      const current = prev[item.id] ?? 1;
      if (current > 1) {
        return { ...prev, [item.id]: current - 1 };
      }
      return prev;
    });
  };

  const handleInputChange = (item: InventoryItem, value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= item.quantity) {
      setQuantities((prev) => ({ ...prev, [item.id]: parsed }));
    }
  };

  const currentQty = (itemId: string) => quantities[itemId] ?? 1;

  return (
    <>
      {items.map((item) => (
        <Card
          key={item.id}
          className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-gray-100 bg-white"
        >
          {/* Product Image Placeholder/Icon */}
          <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
            <CubeIcon className="w-12 h-12 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-2 right-2">
              <Badge
                variant={item.quantity > 10 ? "secondary" : item.quantity > 0 ? "outline" : "destructive"}
                className="bg-white/80 backdrop-blur-sm border-none shadow-sm text-[10px] font-bold"
              >
                {item.quantity > 0 ? `${item.quantity} In Stock` : "Out of Stock"}
              </Badge>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />
          </div>

          <div className="p-4 flex flex-col flex-1">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                {item.item_name}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs font-semibold text-gray-400">{paymentConfiguration?.currency}</span>
                <span className="text-lg font-black text-gray-900">
                  {Number(item.unit_price).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white hover:text-primary transition-all rounded-md"
                  onClick={() => handleDecrease(item)}
                  disabled={currentQty(item.id) <= 1 || item.quantity === 0}
                >
                  <MinusIcon className="w-4 h-4" />
                </Button>

                <Input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={currentQty(item.id)}
                  onChange={(e) => handleInputChange(item, e.target.value)}
                  className="h-7 w-12 border-none bg-transparent text-center font-bold text-sm focus-visible:ring-0 p-0"
                  disabled={item.quantity === 0}
                />

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white hover:text-primary transition-all rounded-md"
                  onClick={() => handleIncrease(item)}
                  disabled={currentQty(item.id) >= item.quantity || item.quantity === 0}
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="sm"
                className="w-full h-9 font-bold transition-all shadow-sm active:scale-[0.98]"
                onClick={() => updateCart(item, currentQty(item.id))}
                disabled={item.quantity === 0}
              >
                <ShoppingBagIcon className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ItemList;
