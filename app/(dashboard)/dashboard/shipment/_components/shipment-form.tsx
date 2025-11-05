"use client";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Shipment, ShipmentStatus, ShipmentType } from "@/types/shipment.types";
import { SalesOrder } from "@/types/sales-order.types";
import { PurchaseOrder } from "@/types/po.types";
import { Customer } from "@/types/customers.types";

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
  type: z.nativeEnum(ShipmentType).default(ShipmentType.DOMESTIC),
  status: z.nativeEnum(ShipmentStatus).default(ShipmentStatus.PENDING),
  orderId: z.string().optional(),
  supplierId: z.string().optional(),
  customerId: z.string().optional(),
  carrier: z.string().optional(),
  originAddress: addressSchema,
  destinationAddress: addressSchema,
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
  deliveryAgentName: z.string().optional(),
  deliveryAgentPhone: z.string().optional(),
  vehiclePlateNumber: z.string().optional(),
  deliveryProofUrl: z.string().optional(),
  recipientName: z.string().optional(),
  recipientSignatureUrl: z.string().optional(),
  isPartialDelivery: z.boolean().optional(),
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
  // suppliers: Supplier[];
  // customers: Customer[];
  products: Product[];
  branches: Branch[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
}

export default function ShipmentForm({
  shipment,
  onSubmit,
  onCancel,
  // suppliers = [],
  // customers = [],
  products = [],
  branches = [],
  salesOrders = [],
  purchaseOrders = [],
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
      type: ShipmentType.DOMESTIC,
      status: ShipmentStatus.PENDING,
      orderId: "",
      supplierId: "",
      customerId: "",
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
      deliveryAgentName: "",
      deliveryAgentPhone: "",
      vehiclePlateNumber: "",
      deliveryProofUrl: "",
      recipientName: "",
      recipientSignatureUrl: "",
      isPartialDelivery: false,
      notes: "",
      items: [],
    },
  });

  const orderId = watch("orderId");
  const type = watch("type");

  const selectedOrder =
    salesOrders.find((o) => o.id === orderId) ||
    purchaseOrders.find((o) => o.id === orderId);

  // Sync selected order items
  useEffect(() => {
    if (selectedOrder?.items) {
      setValue(
        "items",
        selectedOrder.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }))
      );
    } else {
      setValue("items", []);
    }
  }, [orderId, selectedOrder, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* --- Shipment Core Details --- */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Enter main shipment information.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tracking Number *"
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
                options={Object.values(ShipmentType).map((v) => ({
                  value: v,
                  label: v.charAt(0).toUpperCase() + v.slice(1),
                }))}
                placeholder="Select Type"
                label="Shipment Type *"
                error={errors.type?.message}
              />
            )}
          />

          {/* <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value ?? ''}
                onValueChange={field.onChange}
                options={suppliers.map((s) => ({
                  value: s.id.toString(),
                  label: s.name,
                }))}
                placeholder="Select Supplier"
                label="Supplier"
                emptyMessage="No suppliers"
                error={errors.supplierId?.message}
              />
            )}
          /> */}

          {/* <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value ?? ''}
                onValueChange={field.onChange}
                options={customers.map((c) => ({
                  value: c.id.toString(),
                  label: c.name,
                }))}
                placeholder="Select Customer"
                label="Customer"
                emptyMessage="No customers"
                error={errors.customerId?.message}
              />
            )}
          /> */}

          {/* Order Select (either sales or purchase) */}
          <Controller
            name="orderId"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value ?? ''}
                onValueChange={field.onChange}
                options={[
                  ...salesOrders.map((o) => ({
                    value: o.id.toString(),
                    label: `Sales Order: ${o.soNumber}`,
                  })),
                  ...purchaseOrders.map((p) => ({
                    value: p.id.toString(),
                    label: `Purchase Order: ${p.poNumber}`,
                  })),
                ]}
                placeholder="Select Order"
                label="Linked Order"
                emptyMessage="No orders available"
                error={errors.orderId?.message}
              />
            )}
          />

          <Input
            label="Carrier"
            {...register("carrier")}
            error={errors.carrier?.message}
          />
        </CardContent>
      </Card>

      {/* --- Domestic Delivery Fields --- */}
      {type === ShipmentType.DOMESTIC && (
        <Card>
          <CardHeader>
            <CardTitle>Domestic Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Delivery Agent Name"
              {...register("deliveryAgentName")}
              error={errors.deliveryAgentName?.message}
            />
            <Input
              label="Delivery Agent Phone"
              {...register("deliveryAgentPhone")}
              error={errors.deliveryAgentPhone?.message}
            />
            <Input
              label="Vehicle Plate Number"
              {...register("vehiclePlateNumber")}
              error={errors.vehiclePlateNumber?.message}
            />
            <Input
              label="Recipient Name"
              {...register("recipientName")}
              error={errors.recipientName?.message}
            />
          </CardContent>
        </Card>
      )}

      {/* --- Items Preview --- */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Items</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedOrder ? (
            <p className="text-gray-500 text-center">No items yet.</p>
          ) : (
            selectedOrder.items.map((item, i) => (
              <div
                key={item.id}
                className="flex justify-between items-center border rounded-md p-3 mb-2"
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <QRCode value={item.productId} size={72} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* --- Notes + Submit --- */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register("notes")}
            placeholder="Write notes..."
            className="w-full min-h-[100px] border rounded p-2"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Shipment"}
        </Button>
      </div>
    </form>
  );
}
