"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

import { Customer } from "@/types/sales-order.types";
import { SalesOrder, SalesOrderStatus } from "@/types/sales-order.types";
import { Product } from "@/types/product.type";

const schema = z.object({
  customerId: z.string().uuid(),
  status: z.nativeEnum(SalesOrderStatus),
  orderDate: z.string(),
  totalAmount: z.coerce.number().min(0),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().min(1),
        unit_price: z.coerce.number().min(0),
      })
    )
    .min(1),
});

type FormData = z.infer<typeof schema>;

interface SalesOrderFormProps {
  customers: Customer[];
  products: Product[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  selectedSO?: Partial<SalesOrder> & { id?: string };
}

export default function SalesOrderForm({
  customers,
  products,
  onSubmit,
  onCancel,
  selectedSO,
}: SalesOrderFormProps) {
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
      customerId: "",
      status: SalesOrderStatus.DRAFT,
      orderDate: "",
      totalAmount: 0,
      items: [],
    },
  });

  const items = useWatch({ control, name: "items" });

  const totalAmount = useMemo(() => {
    return items?.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
      0
    );
  }, [items]);

  useEffect(() => {
    setValue("totalAmount", totalAmount);
  }, [totalAmount, setValue]);

  useEffect(() => {
    if (!selectedSO?.id) return;

    setValue("customerId", selectedSO.customer?.id || "");
    setValue("status", selectedSO.status ?? SalesOrderStatus.DRAFT);
    setValue("orderDate", selectedSO.orderDate?.slice(0, 10) || "");
    setValue(
      "items",
      selectedSO.items?.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unit_price:
          typeof item.unit_price === "string"
            ? parseFloat(item.unit_price)
            : item.unit_price,
      })) || []
    );
  }, [selectedSO, setValue]);

  const appendItem = () => {
    setValue("items", [
      ...(items || []),
      { productId: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setValue(
      "items",
      items.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Customer</Label>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value || "empty"}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Order Date</Label>
            <Input type="date" {...register("orderDate")} />
          </div>

          <div>
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SalesOrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-end gap-4"
            >
              <div className="flex-1">
                <Label>Product</Label>
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
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex-1">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="flex-1">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unit_price`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="md:ml-auto">
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

          <Button type="button" variant="outline" onClick={appendItem}>
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full ml-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
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
