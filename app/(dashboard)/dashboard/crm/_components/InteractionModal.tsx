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
import { Textarea } from "@/components/ui/textarea";
import { useInteractionStore } from "@/store/crm/useInteractionStore";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import {
  Interaction,
  InteractionType,
  CreateInteractionDto,
} from "@/types/crm.types";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  type: z.nativeEnum(InteractionType, {
    errorMap: () => ({ message: "Please select an interaction type" }),
  }),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

interface InteractionModalProps {
  open: boolean;
  onClose: () => void;
  interaction?: Interaction | null;
  onSuccess: () => void;
}

export default function InteractionModal({
  open,
  onClose,
  interaction,
  onSuccess,
}: InteractionModalProps) {
  const { createInteraction, updateInteraction, loading } =
    useInteractionStore();
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
      customerId: interaction?.customer.id || "",
      type: interaction?.type || InteractionType.NOTE,
      description: interaction?.description || "",
    },
  });

  React.useEffect(() => {
    if (interaction) {
      reset({
        customerId: interaction.customer.id,
        type: interaction.type,
        description: interaction.description,
      });
    } else {
      reset({
        customerId: "",
        type: InteractionType.NOTE,
        description: "",
      });
    }
  }, [interaction, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (interaction) {
        await updateInteraction(interaction.id, data);
        toast({
          title: "Success",
          description: "Interaction updated successfully",
        });
      } else {
        await createInteraction(data);
        toast({
          title: "Success",
          description: "Interaction created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save interaction",
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
            {interaction ? "Edit Interaction" : "Add New Interaction"}
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
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Selector
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { value: InteractionType.CALL, label: "Call" },
                    { value: InteractionType.EMAIL, label: "Email" },
                    { value: InteractionType.MEETING, label: "Meeting" },
                    { value: InteractionType.NOTE, label: "Note" },
                  ]}
                  placeholder="Select interaction type"
                  label="Interaction Type *"
                  error={errors.type?.message}
                />
              )}
            />
          </div>

          <div>
            <Textarea
              label="Description *"
              placeholder="Enter interaction details..."
              {...register("description")}
              error={errors.description?.message}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : interaction ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
