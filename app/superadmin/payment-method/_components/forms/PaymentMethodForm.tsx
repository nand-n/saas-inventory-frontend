// components/forms/PaymentMethodForm.tsx
"use client";
import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import {
  PaymentMethod,
  usePaymentMethod,
} from "@/store/payment-method/usePaymentMethod";
import { Plan, usePlan } from "@/store/plan/usePlan";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  payment_method: string;
  currency: string;
  currencyCode: string;
  card_number?: string;
  isFree: boolean;
  phone_number?: string;
  planId?: string;
}

interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;
  defaultData?: Partial<PaymentMethod>;
  id?: string;
}

export default function PaymentMethodForm({
  open,
  setOpen,
  defaultData = {},
  id,
}: Props) {
  const { createMethod, updateMethod } = usePaymentMethod();
  const { plans, fetchPlans } = usePlan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      payment_method: defaultData.payment_method || "",
      currency: defaultData.currency || "",
      currencyCode: defaultData.currencyCode || "",
      card_number: defaultData.card_number || "",
      isFree: !!defaultData.isFree,
      phone_number: defaultData.phone_number || "",
      planId: defaultData.planId || "",
    },
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    reset({
      payment_method: defaultData.payment_method || "",
      currency: defaultData.currency || "",
      currencyCode: defaultData.currencyCode || "",
      card_number: defaultData.card_number || "",
      isFree: !!defaultData.isFree,
      phone_number: defaultData.phone_number || "",
      planId: defaultData.planId || "",
    });
  }, [defaultData, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      payment_method: data.payment_method,
      currency: data.currency,
      currencyCode: data.currencyCode,
      card_number: data.card_number || undefined,
      isFree: data.isFree,
      phone_number: data.phone_number || undefined,
      planId: data.planId || undefined,
    };
    if (id) await updateMethod(id, payload);
    else await createMethod(payload);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      modalTrigger={<></>}
      title={id ? "Edit Payment Method" : "New Payment Method"}
      description="Fill out the details for this payment method."
      onCancel={() => setOpen(false)}
      onConfirm={handleSubmit(onSubmit)}
    >
      <form className="space-y-3 p-1 ">
        <Input
          {...register("payment_method", { required: "Method is required" })}
          placeholder="Payment Method"
        />
        {errors.payment_method && (
          <p className="text-red-600 text-sm">
            {errors.payment_method.message}
          </p>
        )}

        <div className="flex gap-2">
          <Input
            {...register("currency", { required: "Currency is required" })}
            placeholder="Currency"
          />
          <Input
            {...register("currencyCode", { required: "Code is required" })}
            placeholder="Currency Code"
          />
        </div>
        {(errors.currency || errors.currencyCode) && (
          <p className="text-red-600 text-sm">
            {errors.currency?.message || errors.currencyCode?.message}
          </p>
        )}

        <Input {...register("card_number")} placeholder="Card Number" />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isFree")} />
          Is Free
        </label>

        <Input {...register("phone_number")} placeholder="Phone Number" />

        <select
          {...register("planId")}
          className="w-full border border-gray-300 px-3 py-2 rounded"
        >
          <option value="">— No Plan —</option>
          {plans.map((p: Plan) => (
            <option key={p.id} value={p.id}>
              {p.plan_name}
            </option>
          ))}
        </select>
      </form>
    </Modal>
  );
}
