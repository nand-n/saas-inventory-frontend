"use client";

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/select";
import {
  CustomsDocumentStatus,
  CustomsDocumentType,
} from "@/types/shipment.types";
import { Trash2 } from "lucide-react";

const hsCodeSchema = z.object({
  hsCode: z.string().min(1, "HS Code is required"),
  description: z.string().optional(),
  dutyRate: z.number().optional(),
  taxRate: z.number().optional(),
});

const attachmentSchema = z.object({
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string(),
  fileSize: z.number(),
});

const customsDocumentSchema = z.object({
  documentNumber: z.string().min(1, "Document number is required"),
  type: z.nativeEnum(CustomsDocumentType),
  status: z.nativeEnum(CustomsDocumentStatus),
  issuedDate: z.string().min(1, "Issued date is required"),
  expiryDate: z.string().optional(),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  issuingCountry: z.string().min(1, "Issuing country is required"),
  description: z.string().optional(),
  declaredValue: z.number().optional(),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
  requiresApproval: z.boolean().default(true),
  shipmentId: z.string().min(1, "Shipment ID is required"),
  hsCodeInfo: z.array(hsCodeSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  rejectionReason: z.string().optional(),
  reviewNotes: z.string().optional(),
});

export type CustomsDocumentFormData = z.infer<typeof customsDocumentSchema>;

interface CustomsDocumentFormProps {
  document?: CustomsDocumentFormData | null;
  shipmentId: string;
  onSubmit: (data: CustomsDocumentFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CustomsDocumentForm({
  document,
  shipmentId,
  onSubmit,
  onCancel,
}: CustomsDocumentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CustomsDocumentFormData>({
    resolver: zodResolver(customsDocumentSchema),
    defaultValues: document || {
      documentNumber: "",
      type: CustomsDocumentType.IMPORT_LICENSE,
      status: CustomsDocumentStatus.DRAFT,
      issuedDate: "",
      expiryDate: "",
      issuingAuthority: "",
      issuingCountry: "",
      description: "",
      declaredValue: undefined,
      currency: "ETB",
      notes: "",
      requiresApproval: true,
      shipmentId,
      hsCodeInfo: [],
      attachments: [],
      rejectionReason: "",
      reviewNotes: "",
    },
  });

  const {
    fields: hsFields,
    append: appendHs,
    remove: removeHs,
  } = useFieldArray({
    control,
    name: "hsCodeInfo",
  });

  const {
    fields: attachmentFields,
    append: appendAttachment,
    remove: removeAttachment,
  } = useFieldArray({
    control,
    name: "attachments",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customs Document</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the customs document information.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Document Number*"
            {...register("documentNumber")}
            error={errors.documentNumber?.message}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={Object.entries(CustomsDocumentType).map(
                  ([key, value]) => ({
                    value,
                    label: key,
                  })
                )}
                placeholder="Select Type"
                label="Type *"
                error={errors.type?.message}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Selector
                value={field.value}
                onValueChange={field.onChange}
                options={Object.entries(CustomsDocumentStatus).map(
                  ([key, value]) => ({
                    value,
                    label: key,
                  })
                )}
                placeholder="Select Status"
                label="Status *"
                error={errors.status?.message}
              />
            )}
          />

          <Input
            label="Issued Date*"
            type="date"
            {...register("issuedDate")}
            error={errors.issuedDate?.message}
          />

          <Input
            label="Expiry Date"
            type="date"
            {...register("expiryDate")}
            error={errors.expiryDate?.message}
          />

          <Input
            label="Issuing Authority*"
            {...register("issuingAuthority")}
            error={errors.issuingAuthority?.message}
          />

          <Input
            label="Issuing Country*"
            {...register("issuingCountry")}
            error={errors.issuingCountry?.message}
          />

          <Input
            label="Declared Value"
            type="number"
            {...register("declaredValue", { valueAsNumber: true })}
            error={errors.declaredValue?.message}
          />

          <Input
            label="Currency"
            {...register("currency")}
            error={errors.currency?.message}
          />

          <Input
            label="Notes"
            {...register("notes")}
            error={errors.notes?.message}
          />
        </CardContent>
      </Card>

      {/* HS Code Info */}
      <Card>
        <CardHeader>
          <CardTitle>HS Code Information</CardTitle>
        </CardHeader>
        <CardContent className=" grid space-y-4">
          {hsFields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Remove icon at top-right */}
              <Button
                type="button"
                onClick={() => removeHs(index)}
                className="absolute -top-1 right-1 text-red-500 bg-red-200 hover:bg-red-400 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <Input
                label="HS Code"
                {...register(`hsCodeInfo.${index}.hsCode` as const)}
                error={errors.hsCodeInfo?.[index]?.hsCode?.message}
              />
              <Input
                label="Description"
                {...register(`hsCodeInfo.${index}.description` as const)}
                error={errors.hsCodeInfo?.[index]?.description?.message}
              />
              <Input
                label="Duty Rate"
                type="number"
                {...register(`hsCodeInfo.${index}.dutyRate` as const, {
                  valueAsNumber: true,
                })}
                error={errors.hsCodeInfo?.[index]?.dutyRate?.message}
              />
              <Input
                label="Tax Rate"
                type="number"
                {...register(`hsCodeInfo.${index}.taxRate` as const, {
                  valueAsNumber: true,
                })}
                error={errors.hsCodeInfo?.[index]?.taxRate?.message}
              />
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="button"
              className=""
              onClick={() =>
                appendHs({
                  hsCode: "",
                  description: "",
                  dutyRate: 0,
                  taxRate: 0,
                })
              }
            >
              Add HS Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {attachmentFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
            >
              <Input
                label="File Name"
                {...register(`attachments.${index}.fileName`)}
              />
              <Input
                label="File URL"
                {...register(`attachments.${index}.fileUrl`)}
              />
              <Input
                label="File Type"
                {...register(`attachments.${index}.fileType`)}
              />
              <Input
                label="File Size"
                type="number"
                {...register(`attachments.${index}.fileSize` as const, {
                  valueAsNumber: true,
                })}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeAttachment(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              appendAttachment({
                fileName: "",
                fileUrl: "",
                fileType: "",
                fileSize: 0,
              })
            }
          >
            Add Attachment
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Document"}
        </Button>
      </div>
    </form>
  );
}
