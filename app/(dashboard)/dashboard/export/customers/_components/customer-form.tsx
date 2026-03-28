"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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
import { X, XIcon } from "lucide-react";

import { Product } from "@/types/product.type";
import { Shipment } from "@/types/shipment.types";
import { Customer, CustomerStatus } from "@/types/customers.types";
import { MultiSelect } from "@/components/ui/multi-select";
import { Branch } from "@/types/branchTypes.type";
import QRCode from "react-qr-code";

/**
 * NOTE:
 * - Adjust NewProductSchema to match your server-side CreateProductDto shape exactly.
 * - This example uses simple checkbox lists for selecting multiple product/shipment ids.
 */

/* ---------- Zod schema ---------- */
const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

const NewProductSchema = z.object({
  // Example fields — replace/add to match your CreateProductDto
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  status: z.nativeEnum(CustomerStatus).optional(),
  productIds: z.array(z.string().uuid()).optional(),
  shipmentIds: z.array(z.string().uuid()).optional(),
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

/* ---------- Props ---------- */
interface CustomerFormProps {
  products: Product[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  selectedCustomer?: Partial<Customer> & { id?: string };
  inventoryCategories: Array<any>;
  branchs: Branch[];
}

/* ---------- Component ---------- */
export default function CustomerForm({
  onSubmit,
  onCancel,
  selectedCustomer,
  inventoryCategories = [],
  products = [],
  branchs = [],
}: CustomerFormProps) {
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
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: {},
      status: undefined,
      productIds: [],
      shipmentIds: [],
      newProducts: [],
    },
  });

  // field array for newProducts
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
  // watch selected product/shipment ids
  const watchedProductIds = useWatch({ control, name: "productIds" }) || [];
  const watchedShipmentIds = useWatch({ control, name: "shipmentIds" }) || [];

  useEffect(() => {
    if (!selectedCustomer?.id) return;

    // map possible shapes to our form
    setValue("name", selectedCustomer.name || "");
    setValue("contactPerson", selectedCustomer.contactPerson || "");
    setValue("email", selectedCustomer.email || "");
    setValue("phone", selectedCustomer.phone || "");
    setValue("address", (selectedCustomer as any).address || {});
    setValue("status", (selectedCustomer as any).status || undefined);

    // if selectedCustomer has related ids, set them:
    const prodIds =
      (selectedCustomer as any).productIds ||
      (selectedCustomer as any).products?.map((p: any) => p.id) ||
      [];
    const shipIds =
      (selectedCustomer as any).shipmentIds ||
      (selectedCustomer as any).shipments?.map((s: any) => s.id) ||
      [];

    setValue("productIds", prodIds);
    setValue("shipmentIds", shipIds);

    // If selectedCustomer has embedded newProducts, set them (optional)
    if ((selectedCustomer as any).newProducts) {
      setValue("newProducts", (selectedCustomer as any).newProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer, setValue]);

  // toggle helper for checkboxes (multi-select)
  const toggleSelection = (name: "productIds" | "shipmentIds", id: string) => {
    const current =
      (name === "productIds" ? watchedProductIds : watchedShipmentIds) || [];
    const exists = current.includes(id);
    const next = exists
      ? current.filter((x: string) => x !== id)
      : [...current, id];
    setValue(name, next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name *</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Contact Person</Label>
            <Input {...register("contactPerson")} />
            {errors.contactPerson && (
              <p className="text-sm text-destructive">
                {errors.contactPerson.message}
              </p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Phone</Label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  key={String(field.value)}
                  value={field.value as any}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CustomerStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">
                {(errors.status as any).message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Street</Label>
            <Input {...register("address.street")} />
          </div>
          <div>
            <Label>City</Label>
            <Input {...register("address.city")} />
          </div>
          <div>
            <Label>State</Label>
            <Input {...register("address.state")} />
          </div>
          <div>
            <Label>Country</Label>
            <Input {...register("address.country")} />
          </div>
          <div>
            <Label>Zip Code</Label>
            <Input {...register("address.zipCode")} />
          </div>
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
                    <div className="col-span-2 grid gap-4 mt-4 md:grid-cols-[1fr_auto_auto] items-center md:items-end">
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
                      <div className="self-end items-center flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSku = handleGenerateSKU(index);
                            setValue(`newProducts.${index}.sku`, newSku);
                          }}
                          type="button"
                          disabled={!watch(`newProducts.${index}.category_id`)}
                        >
                          Generate SKU
                        </Button>
                      </div>

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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
