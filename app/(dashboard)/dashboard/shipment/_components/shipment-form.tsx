"use client";

import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/select";
import QRCode from "react-qr-code";
import { Branch } from "@/types/branchTypes.type";
import { Supplier } from "@/types/supplier.types";
import { Product } from "@/types/product.type";
import { Shipment, ShipmentStatus } from "@/types/shipment.types";
import { SalesOrder } from "@/types/sales-order.types";

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().optional(),
});

const customsInfoSchema = z.object({
  declarationNumber: z.string().optional(),
  dutyAmount: z.number().optional(),
  taxAmount: z.number().optional(),
  clearanceDate: z.string().optional(),
});

const shipmentSchema = z.object({
  trackingNumber: z.string().min(1, "Shipment number is required"),
  type: z.enum(["import", "export", "domestic"]).default("import"),
  status: z.nativeEnum(ShipmentStatus).default(ShipmentStatus.PENDING),
  orderId: z.string().min(1, "Order is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  carrier: z.string().optional(),
  originAddress: addressSchema.optional(),
  destinationAddress: addressSchema.optional(),
  shippedDate: z.string().optional(),
  estimatedDeliveryDate: z.string().optional(),
  actualDeliveryDate: z.string().nullable().optional(),
  weight: z.number().optional(),
  shippingCost: z.number().optional(),
  containerNumber: z.string().optional(),
  vesselName: z.string().optional(),
  portOfLoading: z.string().optional(),
  portOfDischarge: z.string().optional(),
  customsInfo: customsInfoSchema.optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one product is required"),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface ShipmentFormProps {
  shipment?: Shipment | null;
  onSubmit: (data: ShipmentFormData) => Promise<void>;
  onCancel: () => void;
  suppliers: Supplier[];
  products: Product[];
  branches: Branch[];
  orders: SalesOrder[];
}

export default function ShipmentForm({
  shipment,
  onSubmit,
  onCancel,
  suppliers = [],
  products = [],
  branches = [],
  orders = [],
}: ShipmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: shipment || {
      trackingNumber: "",
      type: "import",
      status: ShipmentStatus.PENDING,
      orderId: "",
      supplierId: "",
      carrier: "",
      originAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      destinationAddress: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      shippedDate: "",
      estimatedDeliveryDate: "",
      actualDeliveryDate: null,
      weight: undefined,
      shippingCost: undefined,
      containerNumber: "",
      vesselName: "",
      portOfLoading: "",
      portOfDischarge: "",
      customsInfo: {
        declarationNumber: "",
        dutyAmount: undefined,
        taxAmount: undefined,
        clearanceDate: "",
      },
      notes: "",
      items: [],
    },
  });

  console.log(errors, "errors");

  const orderId = watch("orderId");
  const selectedOrder = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (selectedOrder?.items) {
      setValue("items", selectedOrder.items);
    } else {
      setValue("items", []);
    }
  }, [orderId, selectedOrder, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipment Details */}do
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the main shipment information.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Shipment Tracking Number*"
            {...register("trackingNumber")}
            error={errors.trackingNumber?.message}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { value: "import", label: "Import" },
                  { value: "export", label: "Export" },
                  { value: "domestic", label: "Domestic" },
                ]}
                placeholder="Select Shipment Type"
                label="Type *"
                error={errors.type?.message}
              />
            )}
          />
          <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={suppliers.map((s) => ({
                  value: s.id.toString(),
                  label: s.name,
                }))}
                placeholder="Select Supplier"
                label="Supplier *"
                emptyMessage="No suppliers available"
                error={errors.supplierId?.message}
              />
            )}
          />
          <Controller
            name="orderId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={orders.map((s) => ({
                  value: s.id.toString(),
                  label: s.soNumber,
                }))}
                placeholder="Select Order"
                label="Order *"
                emptyMessage="No Order available"
                error={errors.orderId?.message}
              />
            )}
          />
          <Input
            label="Carrier"
            {...register("carrier")}
            error={errors.carrier?.message}
          />

          {/* Addresses grouped side-by-side */}
          <Card className="col-span-full mt-4">
            <CardContent className="grid grid-cols-2 gap-6">
              {/* Origin Address */}
              <div>
                <CardTitle className="mb-3">Origin Address</CardTitle>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Street *"
                    {...register("originAddress.street")}
                    error={errors.originAddress?.street?.message}
                  />
                  <Input
                    label="City *"
                    {...register("originAddress.city")}
                    error={errors.originAddress?.city?.message}
                  />
                  <Input
                    label="State"
                    {...register("originAddress.state")}
                    error={errors.originAddress?.state?.message}
                  />
                  <Input
                    label="Country *"
                    {...register("originAddress.country")}
                    error={errors.originAddress?.country?.message}
                  />
                  <Input
                    label="Zip Code"
                    {...register("originAddress.zipCode")}
                    error={errors.originAddress?.zipCode?.message}
                  />
                </div>
              </div>

              {/* Destination Address */}
              <div>
                <CardTitle className="mb-3">Destination Address</CardTitle>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Street *"
                    {...register("destinationAddress.street")}
                    error={errors.destinationAddress?.street?.message}
                  />
                  <Input
                    label="City *"
                    {...register("destinationAddress.city")}
                    error={errors.destinationAddress?.city?.message}
                  />
                  <Input
                    label="State"
                    {...register("destinationAddress.state")}
                    error={errors.destinationAddress?.state?.message}
                  />
                  <Input
                    label="Country *"
                    {...register("destinationAddress.country")}
                    error={errors.destinationAddress?.country?.message}
                  />
                  <Input
                    label="Zip Code"
                    {...register("destinationAddress.zipCode")}
                    error={errors.destinationAddress?.zipCode?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full mt-4">
            <CardContent className="grid grid-cols-2 gap-6">
              <Input
                label="Shipped Date"
                type="date"
                {...register("shippedDate")}
                error={errors.shippedDate?.message}
              />
              <Input
                label="Estimated Delivery Date"
                type="date"
                {...register("estimatedDeliveryDate")}
                error={errors.estimatedDeliveryDate?.message}
              />
              <Input
                label="Actual Delivery Date"
                type="date"
                {...register("actualDeliveryDate")}
                error={errors.actualDeliveryDate?.message}
              />
              <Input
                label="Weight"
                type="number"
                {...register("weight", { valueAsNumber: true })}
                error={errors.weight?.message}
              />
              <Input
                label="Shipping Cost"
                type="number"
                {...register("shippingCost", { valueAsNumber: true })}
                error={errors.shippingCost?.message}
              />
              <Input
                label="Container Number"
                {...register("containerNumber")}
                error={errors.containerNumber?.message}
              />
              <Input
                label="Vessel Name"
                {...register("vesselName")}
                error={errors.vesselName?.message}
              />
              <Input
                label="Port Of Loading"
                {...register("portOfLoading")}
                error={errors.portOfLoading?.message}
              />
              <Input
                label="Port Of Discharge"
                {...register("portOfDischarge")}
                error={errors.portOfDischarge?.message}
              />
            </CardContent>
          </Card>

          {/* Customs Info */}
          <Card className="col-span-full p-4 mt-4">
            <CardTitle className="mb-4">Customs Information</CardTitle>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Declaration Number"
                {...register("customsInfo.declarationNumber")}
                error={errors.customsInfo?.declarationNumber?.message}
              />
              <Input
                label="Duty Amount *"
                type="number"
                {...register("customsInfo.dutyAmount", { valueAsNumber: true })}
                error={errors.customsInfo?.dutyAmount?.message}
              />
              <Input
                label="Tax Amount *"
                type="number"
                {...register("customsInfo.taxAmount", { valueAsNumber: true })}
                error={errors.customsInfo?.taxAmount?.message}
              />
              <Input
                label="Clearance Date"
                type="date"
                {...register("customsInfo.clearanceDate")}
                error={errors.customsInfo?.clearanceDate?.message}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      {/* Shipment Items */}
      {/* Products in Shipment */}
      <Card>
        <CardHeader>
          <CardTitle>Products in Shipment</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Products included in the selected order.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedOrder || selectedOrder.items.length === 0 ? (
            <p className="text-center text-gray-500">No products to display</p>
          ) : (
            selectedOrder.items.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-md p-4 space-y-4"
              >
                <div className="font-semibold text-lg">Item {index + 1}</div>

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-full md:w-1/2">
                    <Input
                      label="Product"
                      type="text"
                      readOnly
                      value={item.productName}
                      disabled
                    />
                  </div>

                  <div className="w-24">
                    <Input
                      label="Quantity"
                      type="number"
                      readOnly
                      value={item.quantity}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <QRCode
                      value={item.productId}
                      size={96}
                      className="border rounded-md shadow-sm"
                    />
                    <span className="text-xs text-muted-foreground mt-1">
                      Product QR Code
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full min-h-[100px] text-left resize-y pt-1 border rounded px-3 py-2"
          />
          {errors.notes && (
            <p className="text-red-600 text-sm">{errors.notes.message}</p>
          )}
        </CardContent>
      </Card>
      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-w-[120px]"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? "Saving..." : "Save Shipment"}
        </Button>
      </div>
    </form>
  );
}
