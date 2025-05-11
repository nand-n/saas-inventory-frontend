"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAsync } from "@/hooks/useAsync";
import { InventoryItem } from "@/types/inventory";
import ItemList from "./_components/item-list";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch inventory data
  const {
    data: inventoryItems,
    loading: isLoading,
    execute: fetchInventoryItems,
  } = useAsync(
    () =>
      axiosInstance.get(`/inventory/inventory-items/`).then((res) => res.data),
    true
  );

  const {
    data: inventoryCategories,
    loading: categoriesLoading,
    execute: fetchCategories,
  } = useAsync(
    () =>
      axiosInstance
        .get(`/inventory/inventory-categories/`)
        .then((res) => res.data),
    true
  );

  // Group items by category with search filter
  const itemsByCategory = useMemo<Record<string, InventoryItem[]>>(() => {
    if (!inventoryItems || !inventoryCategories) return {};
    return inventoryItems
      .filter((item: { item_name: string }) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .reduce((acc: { [x: string]: any[] }, item: { category_id: any }) => {
        const category =
          inventoryCategories.find((c: any) => c.id === item.category_id)
            ?.category_name || "Uncategorized";

        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {} as Record<string, InventoryItem[]>);
  }, [inventoryItems, inventoryCategories, searchTerm]);

  // Set default active category
  useEffect(() => {
    if (!activeCategory && Object.keys(itemsByCategory).length > 0) {
      setActiveCategory(Object.keys(itemsByCategory)[0]);
    }
  }, [itemsByCategory, activeCategory]);

  // Handle sell action
  const handleSell = (item: InventoryItem) => {
    // Update cart
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.item_name,
          price: Number(item.unit_price),
          quantity: 1,
        },
      ];
    });

    // Update inventory (optimistic update)
    // axiosInstance
    //   .patch(`/inventory/inventory-items/${item.id}`, {
    //     quantity: Math.max(0, item.quantity - 1),
    //   })
    //   .then(() => fetchInventoryItems());
  };

  const handleComplateSale = () => {
    cart.map((item) => {
      axiosInstance
        .patch(`/inventory/inventory-items/${item.id}`, {
          quantity: Math.max(0, item.quantity - 1),
        })
        .then(() => fetchInventoryItems());
    });
  };

  // Calculate total
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Category tabs
  const categoryTabs = useMemo(() => {
    return Object.keys(itemsByCategory).map((category) => ({
      value: category,
      label: category,
      count: itemsByCategory[category].length,
    }));
  }, [itemsByCategory]);

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Product Catalog */}
      <div className="flex-1">
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4">
            {categoryTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex gap-2"
              >
                {tab.label}
                <Badge variant="outline">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-180px)]">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* {items.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{item.item_name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.unit_price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {item.quantity}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleSell(item)}
                        disabled={item.quantity === 0}
                      >
                        {item.quantity > 0 ? "Sell" : "Out of Stock"}
                      </Button>
                    </Card>
                  ))} */}

                  <ItemList handleSell={handleSell} items={items} />
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Cart Summary */}
      <div className="w-96 border-l p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCart((prev) => prev.filter((i) => i.id !== item.id))
                      }
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-center text-gray-500">No items in cart</p>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <Button onClick={handleComplateSale} className="w-full mt-4">
                  Complete Sale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPage;
