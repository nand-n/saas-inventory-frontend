"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useOpportunityStore } from "@/store/crm/useOpportunityStore";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import {
  Opportunity,
  OpportunityStatus,
  CreateOpportunityDto,
} from "@/types/crm.types";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  title: z.string().min(1, "Title is required"),
  estimatedValue: z.coerce
    .number()
    .min(0, "Estimated value must be >= 0")
    .optional(),
  status: z.nativeEnum(OpportunityStatus, {
    errorMap: () => ({ message: "Please select a status" }),
  }),
  expectedClosingDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface OpportunityModalProps {
  open: boolean;
  onClose: () => void;
  opportunity?: Opportunity | null;
  onSuccess: () => void;
}

export default function OpportunityModal({
  open,
  onClose,
  opportunity,
  onSuccess,
}: OpportunityModalProps) {
  const { createOpportunity, updateOpportunity, loading } =
    useOpportunityStore();
  const { customers } = useCRMCustomerStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: opportunity?.customer.id || "",
      title: opportunity?.title || "",
      estimatedValue: opportunity?.estimatedValue || undefined,
      status: opportunity?.status || OpportunityStatus.NEW,
      expectedClosingDate: opportunity?.expectedClosingDate || "",
    },
  });

  React.useEffect(() => {
    if (opportunity) {
      reset({
        customerId: opportunity.customer.id,
        title: opportunity.title,
        estimatedValue: opportunity.estimatedValue || undefined,
        status: opportunity.status,
        expectedClosingDate: opportunity.expectedClosingDate || "",
      });
    } else {
      reset({
        customerId: "",
        title: "",
        estimatedValue: undefined,
        status: OpportunityStatus.NEW,
        expectedClosingDate: "",
      });
    }
  }, [opportunity, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (opportunity) {
        await updateOpportunity(opportunity.id, data);
        toast({
          title: "Success",
          description: "Opportunity updated successfully",
        });
      } else {
        await createOpportunity(data);
        toast({
          title: "Success",
          description: "Opportunity created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save opportunity",
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
            {opportunity ? "Edit Opportunity" : "Add New Opportunity"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Selector
                  value={field.value}
                  onValueChange={field.onChange}
                  options={customers.map((customer) => ({
                    value: customer.id,
                    label: customer.name,
                  }))}
                  placeholder="Select customer"
                  label="Customer *"
                  error={errors.customerId?.message}
                />
              )}
            />
          </div>

          <div>
            <Input
              label="Title *"
              placeholder="Enter opportunity title..."
              {...register("title")}
              error={errors.title?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Estimated Value"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                {...register("estimatedValue")}
                error={errors.estimatedValue?.message}
              />
            </div>
            <div>
              <Input
                label="Expected Closing Date"
                type="date"
                {...register("expectedClosingDate")}
                error={errors.expectedClosingDate?.message}
              />
            </div>
          </div>

          <div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Selector
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { value: OpportunityStatus.NEW, label: "New" },
                    {
                      value: OpportunityStatus.IN_PROGRESS,
                      label: "In Progress",
                    },
                    { value: OpportunityStatus.WON, label: "Won" },
                    { value: OpportunityStatus.LOST, label: "Lost" },
                  ]}
                  placeholder="Select status"
                  label="Status *"
                  error={errors.status?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : opportunity ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
