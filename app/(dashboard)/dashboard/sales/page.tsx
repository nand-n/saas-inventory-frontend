"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { SheetProvider, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

const SalesPage = () => {
  const { paymentConfiguration } = useConfigurationStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
  } = useAsync(
    () =>
      axiosInstance
        .get(`/inventory/inventory-categories/`)
        .then((res) => res.data),
    true
  );

  const {
    data: coas = [],
  } = useAsync(
    () =>
      axiosInstance.get("/accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  const [formData, setFormData] = useState({
    cogsAccountId: "",
    salesRevenueAccountId: "",
    cashAccountId: "",
    inventoryAccountId: "",
  });

  // Group items by category with search filter
  const itemsByCategory = useMemo<Record<string, InventoryItem[]>>(() => {
    if (!inventoryItems || !inventoryCategories) return {};
    return inventoryItems
      .filter((item: InventoryItem) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .reduce((acc: Record<string, InventoryItem[]>, item: InventoryItem) => {
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
  const updateCart = (item: InventoryItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.item_name,
          unitPrice: Number(item.unit_price),
          unitCost: Number(item.unit_cost),
          quantity,
        },
      ];
    });
    toast({
      title: "Added to cart",
      description: `${item.item_name} added successfully`,
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

      await axiosInstance.post("/pos/sale", salePayload);
      setCart([]);
      fetchInventoryItems();
      toast({
        title: "Sale Complete",
        description: "The sale has been processed successfully.",
      });
    } catch (error) {
      console.error("Sale failed:", error);
      toast({
        variant: "destructive",
        title: "Sale Failed",
        description: "There was an error processing the sale.",
      });
    }
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const categoryTabs = useMemo(() => {
    return Object.keys(itemsByCategory).map((category) => ({
      value: category,
      label: category,
      count: itemsByCategory[category].length,
    }));
  }, [itemsByCategory]);

  const areSettingsConfigured = useMemo(() => {
    return (
      formData.cashAccountId !== "" &&
      formData.cogsAccountId !== "" &&
      formData.inventoryAccountId !== "" &&
      formData.salesRevenueAccountId !== ""
    );
  }, [formData]);

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className={!areSettingsConfigured ? "border-amber-500 text-amber-500 animate-pulse" : ""}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>
          <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <ShoppingCartIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{cart.length} items</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content - Product Catalog */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="bg-transparent h-auto p-0 gap-2">
                  {categoryTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-full px-6 py-2 border data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all text-sm font-medium"
                    >
                      {tab.label}
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-gray-100 text-gray-600 border-none group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white"
                      >
                        {tab.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            {Object.entries(itemsByCategory).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <ItemList updateCart={updateCart} items={items} />
                </div>
              </TabsContent>
            ))}

            {Object.keys(itemsByCategory).length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MagnifyingGlassIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>No products found matching your search</p>
              </div>
            )}
          </Tabs>
        </div>

        {/* Right Sidebar - Checkout */}
        <div className="w-96 bg-white border-l flex flex-col shadow-xl">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Current Sale
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCart([])}
              className="text-gray-400 hover:text-destructive"
              disabled={cart.length === 0}
            >
              Clear
            </Button>
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-50 rounded-xl p-4 transition-all hover:ring-1 hover:ring-primary/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-900 leading-tight pr-6">{item.name}</p>
                    <button
                      onClick={() => setCart((prev) => prev.filter((i) => i.id !== item.id))}
                      className="absolute right-3 top-3 p-1 rounded-md opacity-0 group-hover:opacity-100 text-gray-400 hover:text-destructive transition-all"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border shadow-sm">
                      <span className="font-medium text-primary">{item.quantity}</span>
                      <span className="text-gray-400 text-xs">×</span>
                      <span className="text-gray-600">
                        {paymentConfiguration?.currency} {item.unitPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-bold text-primary">
                      {paymentConfiguration?.currency} {(item.unitPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <ShoppingCartIcon className="h-8 w-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Cart is empty</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 bg-gray-50 border-t space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{paymentConfiguration?.currency} {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{paymentConfiguration?.currency} {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {!areSettingsConfigured && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 flex gap-2">
                <Cog6ToothIcon className="h-4 w-4 flex-shrink-0" />
                <p>Please configure accounting accounts in settings to complete the sale.</p>
              </div>
            )}

            <Button
              disabled={!areSettingsConfigured || cart.length === 0}
              onClick={handleCompleteSale}
              className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Complete Sale
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Drawer */}
      <SheetProvider open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="flex flex-col h-full bg-white">
          <SheetHeader >
            <SheetTitle>Accounting Setup</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)}>
              <PlusIcon className="h-6 w-6 rotate-45" />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-sm text-gray-500">
              Select the matching accounts for accurate financial recording of this transaction.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Inventory Account</label>
                <Select
                  value={formData.inventoryAccountId}
                  onValueChange={(value) => setFormData({ ...formData, inventoryAccountId: value })}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-none h-11">
                    <SelectValue placeholder="Select Inventory Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas?.filter((item: any) => Number(item.code) >= 1000 && Number(item.code) < 2000)
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>{coa.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">COGS Account</label>
                <Select
                  value={formData.cogsAccountId}
                  onValueChange={(value) => setFormData({ ...formData, cogsAccountId: value })}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-none h-11">
                    <SelectValue placeholder="Select COGS Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas?.filter((item: any) => Number(item.code) >= 5000 && Number(item.code) < 6000)
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>{coa.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Sales Revenue Account</label>
                <Select
                  value={formData.salesRevenueAccountId}
                  onValueChange={(value) => setFormData({ ...formData, salesRevenueAccountId: value })}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-none h-11">
                    <SelectValue placeholder="Select Revenue Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas?.filter((item: any) => Number(item.code) >= 4000 && Number(item.code) < 5000)
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>{coa.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Cash Account</label>
                <Select
                  value={formData.cashAccountId}
                  onValueChange={(value) => setFormData({ ...formData, cashAccountId: value })}
                >
                  <SelectTrigger className="w-full bg-gray-50 border-none h-11">
                    <SelectValue placeholder="Select Cash Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {coas?.filter((item: any) => Number(item.code) >= 1000 && Number(item.code) < 2000)
                      .map((coa: ChartOfAccount) => (
                        <SelectItem key={coa.id} value={coa.id ?? ""}>{coa.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <Button className="w-full h-11" onClick={() => setIsSettingsOpen(false)}>
              Apply Configuration
            </Button>
          </div>
        </SheetContent>
      </SheetProvider>
    </div>
  );
};

export default SalesPage;
