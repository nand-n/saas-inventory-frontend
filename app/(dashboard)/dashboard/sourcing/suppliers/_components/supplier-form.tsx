"use client";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier } from "@/types/supplier.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.type";
import { MultiSelect } from "@/components/ui/multi-select";
import { XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCode from "react-qr-code";
import { Branch } from "@/types/branchTypes.type";

const schema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  performanceRating: z.coerce.number().min(0).max(5).optional(),
  leadTimeDays: z.coerce.number().min(0).optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  newProducts: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        description: z.string().optional(),
        category_id: z.string(),
        branch_id: z.string(),
        unit_price: z.number(),
        unit_cost: z.number(),
        weight: z.number().optional(),
        dimensions: z
          .object({
            length: z.number(),
            width: z.number(),
            height: z.number(),
          })
          .optional(),
        barcode: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  products: Product[];
  inventoryCategories: Array<any>;
  branchs: Branch[];
}

export default function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  products = [],
  inventoryCategories = [],
  branchs = [],
}: SupplierFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: supplier?.name || "",
      contactPerson: supplier?.contactPerson || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      street: supplier?.address?.street || "",
      city: supplier?.address?.city || "",
      state: supplier?.address?.state || "",
      zipCode: supplier?.address?.zipCode || "",
      country: supplier?.address?.country || "",
      status: supplier?.status || "active",
      performanceRating: Number(supplier?.performanceRating) || 0,
      leadTimeDays: Number(supplier?.leadTimeDays) || 0,
      paymentTerms: supplier?.paymentTerms || "",
      notes: supplier?.notes || "",
      productIds: supplier?.products?.map((p) => p.id) || [],
      newProducts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "newProducts",
  });
  const [createNewProduct, setCreateNewProduct] = useState(true);

  const handleGenerateSKU = (index: number): string => {
    const catId = watch(`newProducts.${index}.category_id` as const);
    const category = inventoryCategories.find((c) => c.id === catId);
    const abbr = category?.category_name.slice(0, 3).toUpperCase() || "GEN";
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${abbr}-${random}`;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <p>Supplier name and main contact person.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Supplier Name *" {...register("name")} />
          <Input label="Contact Person" {...register("contactPerson")} />
          <Input label="Email" type="email" {...register("email")} />
          <Input label="Phone" {...register("phone")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <p>Supplier’s physical address.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Street" {...register("street")} />
          <Input label="City" {...register("city")} />
          <Input label="State" {...register("state")} />
          <Input label="Zip Code" {...register("zipCode")} />
          <Input label="Country" {...register("country")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Performance</CardTitle>
          <p>Lead time, rating and payment terms.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lead Time (Days)"
            type="number"
            {...register("leadTimeDays")}
          />
          <Input label="Payment Terms" {...register("paymentTerms")} />
          <Input label="Notes" {...register("notes")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <p>Select existing products or add new ones.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ✅ Toggle Create New Product */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={createNewProduct}
              onChange={(e) => setCreateNewProduct(e.target.checked)}
            />
            <span>Create New Product</span>
          </label>

          {/* ✅ If NOT creating new product, show multi-select */}
          {!createNewProduct && (
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={products.map((p) => ({
                    label: `${p.name} (${p.sku})`,
                    value: p.id,
                  }))}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Select product(s)"
                />
              )}
            />
          )}

          {/* ✅ If creating new, show dynamic fields */}
          {createNewProduct && (
            <>
              {fields.map((field, index) => (
                <div key={index}>
                  <div className="flex w-full justify-between">
                    <span>Product {index + 1}</span>{" "}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-300 hover:text-red-800"
                      onClick={() => remove(index)}
                    >
                      <XIcon size={24} className="font-bold" />
                    </Button>
                  </div>
                  <div
                    key={field.id}
                    className="col-span-2 grid grid-cols-1 md:grid-cols-2  gap-2 border p-4 rounded-md space-y-2"
                  >
                    <Input
                      label="Product Name"
                      {...register(`newProducts.${index}.name`)}
                    />
                    <Input
                      label="Description"
                      {...register(`newProducts.${index}.description`)}
                    />
                    <div className="space-y-2 gap-2 w-full">
                      <label className="text-sm font-medium">Category</label>
                      <Controller
                        name={`newProducts.${index}.category_id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryCategories?.map((category) => (
                                <SelectItem
                                  className="cursor-pointer w-full"
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.category_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2 gap-2 w-full">
                      <label className="text-sm font-medium">Branch</label>
                      <Controller
                        name={`newProducts.${index}.branch_id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branchs?.map((branch) => (
                                <SelectItem
                                  className="cursor-pointer w-full"
                                  key={branch.id}
                                  value={branch.id}
                                >
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <Input
                      label="Price"
                      type="number"
                      {...register(`newProducts.${index}.unit_price`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label="Cost"
                      type="number"
                      {...register(`newProducts.${index}.unit_cost`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label="Weight"
                      type="number"
                      {...register(`newProducts.${index}.weight`, {
                        valueAsNumber: true,
                      })}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Length"
                        type="number"
                        {...register(`newProducts.${index}.dimensions.length`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        label="Width"
                        type="number"
                        {...register(`newProducts.${index}.dimensions.width`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        label="Height"
                        type="number"
                        {...register(`newProducts.${index}.dimensions.height`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <Input
                      label="Barcode"
                      {...register(`newProducts.${index}.barcode`)}
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`newProducts.${index}.isActive`)}
                        defaultChecked
                      />
                      <span>Active</span>
                    </label>
                    <div className="flex justify-end  w-full "></div>
                    <div className="col-span-2 grid gap-4 mt-4 md:grid-cols-[1fr_auto_auto] items-start md:items-end">
                      {/* SKU Input */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-muted-foreground">
                          SKU
                        </label>
                        <Controller
                          name={`newProducts.${index}.sku`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="Enter SKU"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      {/* Generate SKU Button */}
                      {!supplier && (
                        <div className="self-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSku = handleGenerateSKU(index);
                              setValue(`newProducts.${index}.sku`, newSku);
                            }}
                            type="button"
                            disabled={
                              !watch(`newProducts.${index}.category_id`)
                            }
                          >
                            Generate SKU
                          </Button>
                        </div>
                      )}

                      {/* QR Code */}
                      {watch(`newProducts.${index}.sku`) && (
                        <div className="flex flex-col items-center md:items-end">
                          <QRCode
                            value={watch(`newProducts.${index}.sku`) || ""}
                            size={128}
                            className="border p-2 rounded-md shadow-sm"
                          />
                          <span className="mt-2 text-xs text-muted-foreground text-center">
                            SKU QR Code
                          </span>
                        </div>
                      )}
                    </div>{" "}
                  </div>
                </div>
              ))}

              <div className="flex w-full justify-end items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      name: "",
                      sku: "",
                      category_id: "",
                      unit_price: 0,
                      unit_cost: 0,
                      branch_id: "",
                    })
                  }
                >
                  Add New Product
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end items-center">
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
