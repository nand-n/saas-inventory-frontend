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
import useConfigurationStore from "@/store/tenant/configurationStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartOfAccount } from "../coa/page";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

const SalesPage = () => {
  const { paymentConfiguration } = useConfigurationStore();

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
  const {
    data: coas = [],
    loading: coaLoading,
    execute: fetchCoas,
  } = useAsync(
    () =>
      axiosInstance.get("/accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  interface FormDataType {
    cogsAccountId: string;
    salesRevenueAccountId: string;
    cashAccountId: string;
    inventoryAccountId: string;
    lines: {
      productId: string;
      quantity: number;
      price: number;
    }[];
  }

  const [formData, setFormData] = useState({
    cogsAccountId: "",
    salesRevenueAccountId: "",
    cashAccountId: "",
    inventoryAccountId: "",
    lines: [],
  });

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
  const updateCart = (item: InventoryItem) => {
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
          unitPrice: Number(item.unit_price),
          unitCost: Number(item.unit_cost),

          quantity: 1,
        },
      ];
    });
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;

    try {
      const salePayload = {
        ...formData,
        lines: cart.map((item) => ({
          itemId: item.id,
          qty: item.quantity,
          unitPrice: item.unitPrice,
          unitCost: item.unitCost,
        })),
      };

      // 1. Submit the sale
      await axiosInstance.post("/pos/sale", salePayload);

      // 3. Clear cart and refresh
      setCart([]);
      fetchInventoryItems();
    } catch (error) {
      console.error("Sale failed:", error);
    }
  };

  // Calculate total
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
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
    <div className="flex flex-col lg:flex-row h-auto min-h-screen gap-4 p-4">
      {/* Product Catalog */}
      <div className="w-full lg:flex-1">
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
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

          <ScrollArea className="max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-180px)]">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <ItemList updateCart={updateCart} items={items} />
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Sale</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ACCOUNT SELECTION */}
            <div className="space-y-4 border-t pt-4">
              {/* Inventory Account */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Inventory Account</label>
                <Select
                  value={formData.inventoryAccountId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, inventoryAccountId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Inventory Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas
                      ?.filter(
                        (item: { code: ChartOfAccount }) =>
                          Number(item.code) >= 1000 && Number(item.code) < 2000
                      )
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>
                          {coa.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* COGS Account */}
              <div className="space-y-2">
                <label className="text-sm font-medium">COGS Account</label>
                <Select
                  value={formData.cogsAccountId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cogsAccountId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="COGS Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas
                      ?.filter(
                        (item: ChartOfAccount) =>
                          Number(item.code) >= 5000 && Number(item.code) < 6000
                      )
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>
                          {coa.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sales Revenue Account */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Sales Revenue Account
                </label>
                <Select
                  value={formData.salesRevenueAccountId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, salesRevenueAccountId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sales Revenue Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas
                      ?.filter(
                        (item: ChartOfAccount) =>
                          Number(item.code) >= 4000 && Number(item.code) < 5000
                      )
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>
                          {coa.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cash or Account Payable */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{"Cash Account"}</label>
                <Select
                  value={formData.cashAccountId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cashAccountId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Cash Account"} />
                  </SelectTrigger>
                  <SelectContent>
                    {coas
                      ?.filter(
                        (item: ChartOfAccount) =>
                          Number(item.code) >= 1000 && Number(item.code) < 2000
                      )
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>
                          {coa.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4 border-t-2 mt-4 pt-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {paymentConfiguration?.currency}{" "}
                      {item.unitPrice}
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
                  <span>
                    {paymentConfiguration?.currency} {totalAmount.toFixed(2)}
                  </span>
                </div>
                <Button
                  disabled={
                    formData.cashAccountId == "" ||
                    formData.cogsAccountId == "" ||
                    formData.inventoryAccountId == "" ||
                    formData.salesRevenueAccountId == ""
                  }
                  onClick={handleCompleteSale}
                  className="w-full my-4"
                >
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
