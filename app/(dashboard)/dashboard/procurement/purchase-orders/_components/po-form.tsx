"use client";
import React, { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Supplier } from "@/types/supplier.types";
import { Product } from "@/types/product.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { PurchaseOrder } from "@/types/po.types";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  supplierId: z.string().uuid(),
  status: z.enum(["issued", "completed", "cancelled"]),
  orderDate: z.string(),
  totalAmount: z.coerce.number().min(0),
  expectedDeliveryDate: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        productName: z.string(),
        quantity: z.coerce.number().min(1),
        unit_cost: z.coerce.number().min(0),
      })
    )
    .min(1),
});

type FormData = z.infer<typeof schema>;

interface PurchaseOrderFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  selectedPO?: Partial<PurchaseOrder> & { id?: string };
}

export default function PurchaseOrderForm({
  suppliers,
  products,
  onSubmit,
  onCancel,
  selectedPO,
}: PurchaseOrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      supplierId: "",
      status: "issued",
      orderDate: "",
      expectedDeliveryDate: "",
      totalAmount: 0,
      items: [],
    },
  });

  useEffect(() => {
    if (selectedPO?.supplier?.id) {
      setValue("supplierId", selectedPO.supplier.id);
    }
  }, [selectedPO?.supplier?.id, setValue]);

  const selectedSupplierId = watch("supplierId");

  const filteredProducts = useMemo(() => {
    if (!selectedSupplierId) return [];
    return products.filter((p) =>
      suppliers
        .find((s) => s.id === selectedSupplierId)
        ?.products?.some((sp) => sp.id === p.id)
    );
  }, [selectedSupplierId, suppliers, products]);

  const items = useWatch({
    control,
    name: "items",
  });

  const totalAmount = useMemo(() => {
    if (!items) return 0;
    return items.reduce(
      (sum: number, item: { quantity: number; unit_cost: number }) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.unit_cost) || 0;
        return sum + quantity * price;
      },
      0
    );
  }, [items]);

  useEffect(() => {
    setValue("totalAmount", totalAmount);
  }, [totalAmount, setValue]);

  useEffect(() => {
    if (!selectedPO?.id) return;
    if (!selectedSupplierId) return;
    if (filteredProducts.length === 0) return;

    const poItems =
      selectedPO.items?.map((item) => ({
        productId: item.productId ?? "",
        productName: item.productName ?? "",
        quantity: Number(item.quantity) ?? 1,
        unit_cost:
          typeof item.unit_cost === "string"
            ? parseFloat(item.unit_cost)
            : item.unit_cost ?? 0,
      })) ?? [];

    setValue("status", (selectedPO.status as any) ?? "issued");
    setValue("orderDate", selectedPO.orderDate?.slice(0, 10) ?? "");
    setValue(
      "expectedDeliveryDate",
      selectedPO.expectedDeliveryDate?.slice(0, 10) ?? ""
    );
    setValue("totalAmount", Number(selectedPO.totalAmount) || 0);
    setValue("items", poItems);
  }, [selectedPO?.id, selectedSupplierId, filteredProducts.length, setValue]);

  const appendItem = () => {
    const updatedItems = [
      ...items,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unit_cost: 0,
      },
    ];
    setValue("items", updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = (items ?? []).filter((_, i) => i !== index);
    setValue("items", updatedItems);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid">
            <Label>Select Supplier</Label>
            <Controller
              name="supplierId"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value || "empty"}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Input label="Order Date" type="date" {...register("orderDate")} />
          <Input
            label="Expected Delivery Date"
            type="date"
            {...register("expectedDeliveryDate")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {watch("items")?.map((field, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row  md:items-end md:gap-4"
            >
              {/* Product Selector */}
              <div className="flex-1 grid gap-1">
                <Label className="my-1">Select Product</Label>
                <Controller
                  name={`items.${index}.productId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500 text-sm">
                            No products found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Quantity */}
              <div className="flex-1">
                <Input
                  label="Quantity"
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Unit Price */}
              <div className="flex-1">
                <Input
                  label="Unit Cost"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unit_cost`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Remove Button aligned right */}
              <div className="md:ml-auto mt-2 md:mt-0">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeItem(index)}
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <Button type="button" variant="outline" onClick={appendItem}>
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full ml-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Invoice Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Subtotal Row */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                
                {formatCurrency(new Intl.NumberFormat(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalAmount))}
              </span>
            </div>
            <hr />

            {/* Total */}
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>
                
                {formatCurrency(new Intl.NumberFormat(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalAmount))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
