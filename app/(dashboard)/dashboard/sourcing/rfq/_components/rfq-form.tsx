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
  Selector,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { RFQ, RFQStatus } from "@/types/rfq.types";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  supplierId: z.string().uuid(),
  status: z.nativeEnum(RFQStatus),
  issuedDate: z.string(),
  validUntil: z.string(),
  totalAmount: z.coerce.number().min(0),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        name: z.string(),
        quantity: z.coerce.number().min(1),
        expectedUnitCost: z.coerce.number().min(0),
      })
    )
    .min(1),
});

type FormData = z.infer<typeof schema>;

interface RfqFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  selectedRFQ?: Partial<RFQ> & { id?: string };
}

export default function RfqForm({
  suppliers,
  products,
  onSubmit,
  onCancel,
  selectedRFQ,
}: RfqFormProps) {
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
      status: RFQStatus.DRAFT,
      issuedDate: "",
      validUntil: "",
      totalAmount: 0,
      items: [],
    },
  });

  useEffect(() => {
    if (selectedRFQ?.supplier?.id) {
      setValue("supplierId", selectedRFQ.supplier.id);
    }
  }, [selectedRFQ?.supplier?.id, setValue]);

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
      (sum: number, item: { quantity: number; expectedUnitCost: number }) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.expectedUnitCost) || 0;
        return sum + quantity * price;
      },
      0
    );
  }, [items]);

  useEffect(() => {
    setValue("totalAmount", totalAmount);
  }, [totalAmount, setValue]);

  useEffect(() => {
    if (!selectedRFQ?.id) return;
    if (!selectedSupplierId) return;
    if (filteredProducts.length === 0) return;

    const rfqItems =
      selectedRFQ.items?.map((item) => ({
        productId: item.productId ?? "",
        name: item.name ?? "",
        quantity: Number(item.quantity) ?? 1,
        expectedUnitCost:
          typeof item.expectedUnitCost === "string"
            ? parseFloat(item.expectedUnitCost)
            : item.expectedUnitCost ?? 0,
      })) ?? [];

    setValue("status", (selectedRFQ.status as any) ?? "draft");
    setValue("issuedDate", selectedRFQ.issuedDate?.slice(0, 10) ?? "");
    setValue("validUntil", selectedRFQ.validUntil?.slice(0, 10) ?? "");
    setValue("totalAmount", Number(selectedRFQ.totalAmount) || 0);
    setValue("items", rfqItems);
  }, [selectedRFQ?.id, selectedSupplierId, filteredProducts.length, setValue]);

  const appendItem = () => {
    const updatedItems = [
      ...items,
      {
        productId: "",
        name: "",
        quantity: 1,
        expectedUnitCost: 0,
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
          <CardTitle>RFQ Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid">
           <Controller
  name="supplierId"
  control={control}
  render={({ field }) => (
    <Selector
      value={field.value}
      onValueChange={field.onChange}
      options={suppliers.map((s) => ({
        value: s.id,
        label: s.name,
      }))}
      placeholder="Select Supplier"
      label="Supplier"
    />
  )}
/>
          </div>

          <Input label="Issued Date" type="date" {...register("issuedDate")} />
          <Input label="Valid Until" type="date" {...register("validUntil")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
                <CardContent className="space-y-4">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border  rounded-md">
      <thead className="">
        <tr className="text-left text-sm font-medium text-gray-700">
          <th className="p-2 border ">#</th>
          <th className="p-2 border ">Product</th>
          <th className="p-2 border ">Quantity</th>
          <th className="p-2 border ">Expected Unit Cost</th>
          <th className="p-2 border  text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {watch("items")?.map((_, index) => (
          <tr key={index} className="text-sm">
            <td className="p-2 border border-mute text-gray-600">
              {index + 1}
            </td>

            <td className="p-2 border ">
              <Controller
                name={`items.${index}.productId`}
                
                control={control}
                render={({ field }) => (
                  <Selector
                  className="rounded-none"
                    value={field.value}
                    // onValueChange={field.onChange}
                      onValueChange={(value) => {
        field.onChange(value);

        // Find selected product and update its name
        const selectedProduct = filteredProducts.find((p) => p.id === value);
        if (selectedProduct) {
          setValue(`items.${index}.name`, selectedProduct.name);
        }
      }}
                    options={
                      filteredProducts.length > 0
                        ? filteredProducts.map((p) => ({
                            value: p.id,
                            label: p.name,
                          }))
                        : []
                    }
                    placeholder={
                      filteredProducts.length > 0
                        ? "Select Product"
                        : "No products found"
                    }
                  />
                )}
              />
            </td>

            <td className="p-2 border ">
              <Input
                type="number"
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
            </td>

            <td className="p-2 border ">
              <Input
                type="number"
                step="0.01"
                {...register(`items.${index}.expectedUnitCost`, {
                  valueAsNumber: true,
                })}
              />
            </td>

            <td className="p-2 border  text-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <Button type="button" variant="outline" onClick={appendItem}>
    Add Item
  </Button>
</CardContent>
      </Card>

      <Card className="w-full ml-auto">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Quotation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
