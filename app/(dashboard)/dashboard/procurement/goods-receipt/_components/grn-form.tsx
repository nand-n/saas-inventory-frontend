// "use client";
// import React from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Selector } from "@/components/ui/select";
// import { XIcon } from "lucide-react";
// import { CreateGoodsReceiptDto } from "@/types/grn.types";
// import { PurchaseOrder } from "@/types/po.types";


// export const GoodsReceiptStatusEnum = z.enum([
//   "DRAFT",
//   "PENDING",
//   "APPROVED",
//   "REJECTED",
// ]);

// export const GRNQCStatusEnum = z.enum(["PASSED", "FAILED", "PENDING"]);

// // -----------------------------
// // ITEM SCHEMA
// // -----------------------------
// const grnItemSchema = z.object({
//   name: z.string().min(1, "name is required"),
//   receivedQuantity: z.coerce.number().min(1, "Received quantity must be > 0"),
//   batchNumber: z.string().optional(),
//   expiryDate: z.string().optional(), // ISO or YYYY-MM-DD
//   unitCost: z.coerce.number().optional(),
// });

// // -----------------------------
// // MAIN GRN SCHEMA
// // -----------------------------
// export const grnSchema = z.object({
//   purchaseOrderId: z.string().min(1, "Purchase order is required"),
//   receivedBy: z.string().min(1, "Receiver name is required"),
//   warehouse: z.string().min(1, "Warehouse is required"),
//   receivedDate: z.string().min(1, "Received date is required"),
//   qcStatus: GRNQCStatusEnum.default("PENDING"),
//   qcRemarks: z.string().optional(),
//   status: GoodsReceiptStatusEnum.default("DRAFT"),
//   items: z
//     .array(grnItemSchema)
//     .min(1, "At least one item must be added to the GRN"),
// });


// type FormData = z.infer<typeof grnSchema>;

// interface GRNFormProps {
//   grn?: CreateGoodsReceiptDto | null;
//   onSubmit: (data: FormData) => Promise<void>;
//   onCancel: () => void;
//   purchaseOrders: PurchaseOrder[];
// }

// export default function GRNForm({ grn, onSubmit, onCancel, purchaseOrders }: GRNFormProps) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     resolver: zodResolver(grnSchema),
//     defaultValues: grn || {
//       purchaseOrderId: "",
//       receivedBy: "",
//       warehouse: "",
//       qcStatus: "PENDING",
//       qcRemarks: "",
//       receivedDate: new Date().toISOString().split("T")[0],
//       items: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "items",
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* ------------------ BASIC INFORMATION ------------------ */}
//       <Card>
//         <CardHeader>
//           <CardTitle>GRN Information</CardTitle>
//           <p>Link this GRN with an existing Purchase Order</p>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//          <Controller
//   name="purchaseOrderId"
//   control={control}
//   render={({ field }) => (
//     <Selector
//     label="Select Purchase Order"
//       value={field.value}
//       onValueChange={field.onChange}
//       options={purchaseOrders.map((po) => ({
//         value: po.id,
//         label: `${po.poNumber} — ${po.supplier.name}`,
//       }))}
//       placeholder="Select Purchase Order"
//     />
//   )}
// />

//           <Input label="Received Date" type="date" {...register("receivedDate")} />
//           <Input label="Received By" {...register("receivedBy")} />
//           <Input label="Warehouse" {...register("warehouse")} />
//         </CardContent>
//       </Card>

//       {/* ------------------ QC SECTION ------------------ */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quality Control</CardTitle>
//           <p>QC verification and remarks</p>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//          <Controller
//   name="qcStatus"
//   control={control}
//   render={({ field }) => (
//     <Selector
//       value={field.value}
//       onValueChange={field.onChange}
//       options={[
//         { value: "PENDING", label: "Pending" },
//         { value: "PASSED", label: "Passed" },
//         { value: "FAILED", label: "Failed" },
//       ]}
//       placeholder="Select QC Status"
//       label="Select QC Status"
//     />
//   )}
// />

//           <Input label="QC Remarks" {...register("qcRemarks")} />
//         </CardContent>
//       </Card>

//       {/* ------------------ ITEMS SECTION ------------------ */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Received Items</CardTitle>
//           <p>Record items received against the PO</p>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {fields.map((item, index) => (
//             <div key={item.id} className="border p-4 rounded-md space-y-2">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-medium">Item {index + 1}</h3>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="text-red-500 hover:bg-red-100"
//                   onClick={() => remove(index)}
//                 >
//                   <XIcon size={20} />
//                 </Button>
//               </div>

//             <div className="grid grid-cols-2 gap-4">
//   <Input label="Name" {...register(`items.${index}.name`)} />
//   <Input
//     label="Received Quantity"
//     type="number"
//     {...register(`items.${index}.receivedQuantity`, { valueAsNumber: true })}
//   />
//   <Input label="Batch Number" {...register(`items.${index}.batchNumber`)} />
//   <Input
//     label="Expiry Date"
//     type="date"
//     {...register(`items.${index}.expiryDate`)}
//   />
//   <Input
//     label="Unit Cost"
//     type="number"
//     {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
//   />
// </div>

//             </div>
//           ))}
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => append({ name: "", receivedQuantity: 0 })}
//           >
//             Add Item
//           </Button>
//         </CardContent>
//       </Card>

//       {/* ------------------ ACTION BUTTONS ------------------ */}
//       <div className="flex gap-2 justify-end">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Saving..." : "Save GRN"}
//         </Button>
//       </div>
//     </form>
//   );
// }



"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Selector,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { CreateGoodsReceiptDto } from "@/types/grn.types";
import { PurchaseOrder } from "@/types/po.types";

// ---------------- ENUMS ----------------
export const GoodsReceiptStatusEnum = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const GRNQCStatusEnum = z.enum(["PASSED", "FAILED", "PENDING"]);

// ---------------- ITEM SCHEMA ----------------
const grnItemSchema = z.object({
  name: z.string().min(1, "name is required"),
  receivedQuantity: z.coerce.number().min(1, "Received quantity must be > 0"),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  unitCost: z.coerce.number().optional(),
});

// ---------------- MAIN SCHEMA ----------------
export const grnSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase order is required"),
  receivedBy: z.string().min(1, "Receiver name is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  qcStatus: GRNQCStatusEnum.default("PENDING"),
  qcRemarks: z.string().optional(),
  status: GoodsReceiptStatusEnum.default("DRAFT"),
  items: z.array(grnItemSchema).min(1, "At least one item must be added"),
});

type FormData = z.infer<typeof grnSchema>;

interface GRNFormProps {
  grn?: CreateGoodsReceiptDto | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  purchaseOrders: PurchaseOrder[];
}

export default function GRNForm({
  grn,
  onSubmit,
  onCancel,
  purchaseOrders,
}: GRNFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(grnSchema),
    defaultValues: grn || {
      purchaseOrderId: "",
      receivedBy: "",
      warehouse: "",
      qcStatus: "PENDING",
      qcRemarks: "",
      receivedDate: new Date().toISOString().split("T")[0],
      items: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const selectedPOId = watch("purchaseOrderId");

  // 🔁 Auto-fill when a PO is selected
  useEffect(() => {
    if (!selectedPOId) return;

    const selectedPO = purchaseOrders.find((po) => po.id === selectedPOId);
    if (!selectedPO) return;

    // Map PO items → GRN items
    const mappedItems = selectedPO.items.map((item) => ({
      name: item.productName || "Unnamed Product",
      receivedQuantity: item.quantity,
      batchNumber: "",
      expiryDate: "",
      unitCost: Number(item.unit_cost),
    }));

    // Replace current form data with auto-filled values
    reset({
      purchaseOrderId: selectedPO.id,
      receivedBy: grn?.receivedBy || "",
      warehouse: grn?.warehouse || "",
      receivedDate: new Date().toISOString().split("T")[0],
      qcStatus: "PENDING",
      qcRemarks: "",
      status: "DRAFT",
      items: mappedItems,
    });
  }, [selectedPOId]);

  // ------------------- FORM RENDER -------------------
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* BASIC INFORMATION */}
      <Card>
        <CardHeader>
          <CardTitle>GRN Information</CardTitle>
          <p>Link this GRN with an existing Purchase Order</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="purchaseOrderId"
            control={control}
            render={({ field }) => (
              <Selector
                label="Select Purchase Order"
                value={field.value}
                onValueChange={field.onChange}
                options={purchaseOrders.map((po) => ({
                  value: po.id,
                  label: `${po.poNumber} — ${po.supplier.name}`,
                }))}
                placeholder="Select Purchase Order"
              />
            )}
          />

          <Input label="Received Date" type="date" {...register("receivedDate")} />
          <Input label="Received By" {...register("receivedBy")} />
          <Input label="Warehouse" {...register("warehouse")} />
        </CardContent>
      </Card>

      {/* QUALITY CONTROL SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Control</CardTitle>
          <p>QC verification and remarks</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="qcStatus"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "PASSED", label: "Passed" },
                  { value: "FAILED", label: "Failed" },
                ]}
                placeholder="Select QC Status"
                label="Select QC Status"
              />
            )}
          />
          <Input label="QC Remarks" {...register("qcRemarks")} />
        </CardContent>
      </Card>

      {/* ITEMS SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Received Items</CardTitle>
          <p>Record items received against the PO</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="border p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Item {index + 1}</h3>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => remove(index)}
                >
                  <XIcon size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" {...register(`items.${index}.name`)} />
                <Input
                  label="Received Quantity"
                  type="number"
                  {...register(`items.${index}.receivedQuantity`, { valueAsNumber: true })}
                />
                <Input label="Batch Number" {...register(`items.${index}.batchNumber`)} />
                <Input
                  label="Expiry Date"
                  type="date"
                  {...register(`items.${index}.expiryDate`)}
                />
                <Input
                  label="Unit Cost"
                  type="number"
                  {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", receivedQuantity: 0 })}
          >
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save GRN"}
        </Button>
      </div>
    </form>
  );
}

