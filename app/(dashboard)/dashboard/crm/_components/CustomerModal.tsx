"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import {
  CRMCustomer,
  CustomerType,
  CreateCRMCustomerDto,
} from "@/types/crm.types";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  type: z.nativeEnum(CustomerType, {
    errorMap: () => ({ message: "Please select a customer type" }),
  }),
});

type FormData = z.infer<typeof schema>;

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer?: CRMCustomer | null;
  onSuccess: () => void;
}

export default function CustomerModal({
  open,
  onClose,
  customer,
  onSuccess,
}: CustomerModalProps) {
  const { createCustomer, updateCustomer, loading } = useCRMCustomerStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      company: customer?.company || "",
      type: customer?.type || CustomerType.IMPORTER,
    },
  });

  React.useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        company: customer.company || "",
        type: customer.type,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        type: CustomerType.IMPORTER,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (customer) {
        await updateCustomer(customer.id, data);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        await createCustomer(data);
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Name *"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>
            <div>
              <Input
                label="Email *"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Phone"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>
            <div>
              <Input
                label="Company"
                {...register("company")}
                error={errors.company?.message}
              />
            </div>
          </div>

          <div>
            <Selector
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as CustomerType)}
              options={[
                { value: CustomerType.IMPORTER, label: "Importer" },
                { value: CustomerType.EXPORTER, label: "Exporter" },
                { value: CustomerType.RETAILER, label: "Retailer" },
              ]}
              placeholder="Select customer type"
              label="Customer Type *"
              error={errors.type?.message}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : customer ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
