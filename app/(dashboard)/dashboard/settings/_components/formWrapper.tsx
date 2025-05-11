"use client";
import { ToastProvider } from "@/components/ui/commons/toastProvider";
import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm(); // Initialize form context

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  return (
           <ToastProvider>
                <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
           </ToastProvider>

  );
};

export default FormWrapper;
