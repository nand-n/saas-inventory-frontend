// components/forms/PlanForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plan, usePlan } from "@/store/plan/usePlan";

interface Highlight {
  description: string;
  disabled?: boolean;
}

interface Feature {
  section: string;
  name: string;
  value: string | number | boolean;
}

interface FormValues {
  plan_name: string;
  description: string;
  currency: string;
  current_price: number;
  isFree: boolean;
  duration: number;
  days_left: number;
  slug: string;
  recuring: string;
  highlights: Highlight[];
  features: Feature[];
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultData?: Partial<Plan>;
  id?: string;
}

export default function PlanForm({
  open,
  setOpen,
  defaultData = {},
  id,
}: Props) {
  const { createPlan, updatePlan } = usePlan();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      plan_name: defaultData.plan_name ?? "",
      description: defaultData.description ?? "",
      currency: defaultData.currency ?? "",
      current_price: defaultData.current_price ?? 0,
      isFree: defaultData.isFree ?? false,
      duration: defaultData.duration ?? 0,
      days_left: defaultData.days_left ?? 0,
      slug: defaultData.slug ?? "",
      recuring: defaultData.recuring ?? "",
      highlights: defaultData.highlights ?? [{ description: "" }],
      features: defaultData.features ?? [{ section: "", name: "", value: "" }],
    },
  });

  // field arrays
  const {
    fields: hlFields,
    append: hlAppend,
    remove: hlRemove,
  } = useFieldArray({
    control,
    name: "highlights",
  });
  const {
    fields: ftFields,
    append: ftAppend,
    remove: ftRemove,
  } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    reset({
      plan_name: defaultData.plan_name ?? "",
      description: defaultData.description ?? "",
      currency: defaultData.currency ?? "",
      current_price: defaultData.current_price ?? 0,
      isFree: defaultData.isFree ?? false,
      duration: defaultData.duration ?? 0,
      days_left: defaultData.days_left ?? 0,
      slug: defaultData.slug ?? "",
      recuring: defaultData.recuring ?? "",
      highlights: defaultData.highlights ?? [{ description: "" }],
      features: defaultData.features ?? [{ section: "", name: "", value: "" }],
    });
  }, [defaultData, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload: Omit<Plan, "id" | "paymentMethods"> = {
      plan_name: data.plan_name,
      description: data.description,
      currency: data.currency,
      current_price: data.current_price,
      isFree: data.isFree,
      duration: data.duration,
      days_left: data.days_left,
      slug: data.slug,
      recuring: data.recuring,
      highlights: data.highlights,
      features: data.features,
    };

    if (id) await updatePlan(id, payload);
    else await createPlan(payload);

    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      //   modalTrigger={<></>}
      title={id ? "Edit Plan" : "New Plan"}
      description="Fill out plan details."
      onCancel={() => setOpen(false)}
      onConfirm={handleSubmit(onSubmit)}
    >
      <form className="space-y-4  overflow-auto p-2">
        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Plan Name"
              {...register("plan_name", { required: "Name is required" })}
              placeholder="Plan Name"
            />
            {errors.plan_name && (
              <p className="text-red-600">{errors.plan_name.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Description"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("currency", { required: "Currency is required" })}
              placeholder="Currency"
              label="Currency"
            />
            {errors.currency && (
              <p className="text-red-600">{errors.currency.message}</p>
            )}
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              {...register("current_price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              placeholder="Price"
              label="Price"
            />
            {errors.current_price && (
              <p className="text-red-600">{errors.current_price.message}</p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("isFree")}
              className="h-4 w-4 mr-2"
            />
            <label>Is Free?</label>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              {...register("duration", {
                required: "Duration is required",
                valueAsNumber: true,
              })}
              placeholder="Duration (days)"
              label="Duration (days)"
            />
            <Input
              type="number"
              {...register("days_left", {
                required: "Days left is required",
                valueAsNumber: true,
              })}
              placeholder="Days Left"
              label="Days Left"
            />
          </div>
          {(errors.duration || errors.days_left) && (
            <p className="text-red-600">
              {errors.duration?.message || errors.days_left?.message}
            </p>
          )}
          <div>
            <Input
              {...register("slug", { required: "Slug is required" })}
              placeholder="Slug"
            />
            {errors.slug && (
              <p className="text-red-600">{errors.slug.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("recuring", { required: "Recurring is required" })}
              placeholder="Recurring"
              label="Recurring"
            />
            {errors.recuring && (
              <p className="text-red-600">{errors.recuring.message}</p>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="font-medium mb-2">Highlights</h3>
          {hlFields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 mb-2 items-center">
              <Input
                {...register(`highlights.${idx}.description` as const, {
                  required: "Required",
                })}
                placeholder="Description"
                label="Description"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  {...register(`highlights.${idx}.disabled` as const)}
                />
                Disabled
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => hlRemove(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => hlAppend({ description: "", disabled: false })}
          >
            + Add Highlight
          </Button>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-medium mb-2">Features</h3>
          {ftFields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 mb-2 items-center">
              <Input
                {...register(`features.${idx}.section` as const, {
                  required: "Required",
                })}
                placeholder="Section"
                label="Section"
              />
              <Input
                {...register(`features.${idx}.name` as const, {
                  required: "Required",
                })}
                placeholder="Name"
                label="Name"
              />
              <Input
                {...register(`features.${idx}.value` as const, {
                  required: "Required",
                })}
                placeholder="Value"
                label="Value"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => ftRemove(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => ftAppend({ section: "", name: "", value: "" })}
          >
            + Add Feature
          </Button>
        </div>
      </form>
    </Modal>
  );
}
