"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/select";
import { LogisticsPartner, LogisticsPartnerFormData } from "@/types/logistics.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, MapPin, Ship, Train, Truck } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

interface LogisticsPartnerFormProps {
  partner?: LogisticsPartner | null;
  onSubmit: (data: LogisticsPartnerFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

// Validation schema
const logisticsPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  type: z.enum([
    "carrier",
    "freight_forwarder",
    "customs_broker",
    "warehouse",
    "logistics_provider",
  ]),
  services: z.array(z.string()).min(1, "At least one service is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  rating: z.number().min(1).max(5),
  status: z.enum(["active", "inactive", "suspended"]),
  contractStartDate: z.string().min(1, "Contract start date is required"),
  contractEndDate: z.string().optional(),
  specializations: z.array(z.string()),
  certifications: z.array(z.string()),
});

type FormData = z.infer<typeof logisticsPartnerSchema>;

const serviceOptions = [
  "Air Freight",
  "Sea Freight",
  "Land Freight",
  "Express Delivery",
  "Customs Clearance",
  "Documentation",
  "Insurance",
  "Packaging",
  "Warehousing",
  "Distribution",
  "Tracking",
  "Consulting",
];

const partnerTypes = [
  { value: "carrier", label: "Shipping Carrier", icon: Truck },
  { value: "freight_forwarder", label: "Freight Forwarder", icon: Ship },
  { value: "customs_broker", label: "Customs Broker", icon: Globe },
  { value: "warehouse", label: "Warehouse", icon: MapPin },
  { value: "logistics_provider", label: "Logistics Provider", icon: Train },
];

const ratingOptions = [
  { value: "1", label: "1 Star" },
  { value: "2", label: "2 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "5", label: "5 Stars" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

function LogisticsPartnerForm({
  partner,
  onSubmit,
  onCancel,
  isLoading,
}: LogisticsPartnerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(logisticsPartnerSchema),
    defaultValues: {
      name: partner?.name || "",
      type: partner?.type || "carrier",
      services: partner?.services || [],
      contactPerson: partner?.contactPerson || "",
      email: partner?.email || "",
      phone: partner?.phone || "",
      address: partner?.address || "",
      country: partner?.country || "",
      rating: partner?.rating || 5,
      status: partner?.status || "active",
      contractStartDate: partner?.contractStartDate || "",
      contractEndDate: partner?.contractEndDate || "",
      specializations: partner?.specializations || [],
      certifications: partner?.certifications || [],
    },
  });

  const watchedServices = watch("services");

  const handleServiceToggle = (service: string) => {
    const currentServices = watchedServices || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    setValue("services", newServices);
  };

  const handleSpecializationsChange = (value: string) => {
    const specializations = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("specializations", specializations);
  };

  const certifications = watch("certifications") || [];
  const [inputValue, setInputValue] = useState("");

  const addCertification = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const updated = [...certifications, trimmed];
    setValue("certifications", updated, { shouldValidate: true });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addCertification(inputValue);
    }
  };

  const removeCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index);
    setValue("certifications", updated, { shouldValidate: true });
  };

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Partner Name</label>
          <Input
            {...register("name")}
            placeholder="Enter partner name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Selector
              label="Type"
              value={field.value}
              onValueChange={field.onChange}
              options={partnerTypes.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
              placeholder="Select partner type"
              error={errors.type?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contact Person
          </label>
          <Input
            {...register("contactPerson")}
            placeholder="Enter contact person name"
            className={errors.contactPerson ? "border-red-500" : ""}
          />
          {errors.contactPerson && (
            <p className="mt-1 text-xs text-red-600">
              {errors.contactPerson.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input
            {...register("phone")}
            placeholder="Enter phone number"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <Input
            {...register("country")}
            placeholder="Enter country"
            className={errors.country ? "border-red-500" : ""}
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <Input
          {...register("address")}
          placeholder="Enter full address"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Selector
              label="Rating"
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
              options={ratingOptions}
              placeholder="Select rating"
              error={errors.rating?.message}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Selector
              label="Status"
              value={field.value}
              onValueChange={field.onChange}
              options={statusOptions}
              placeholder="Select status"
              error={errors.status?.message}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Contract Start Date
          </label>
          <Input
            type="date"
            {...register("contractStartDate")}
            className={errors.contractStartDate ? "border-red-500" : ""}
          />
          {errors.contractStartDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.contractStartDate.message}
            </p>
          )}
        </div>{" "}
        <div>
          <label className="block text-sm font-medium mb-2">
            Contract Start Date
          </label>
          <Input
            type="date"
            {...register("contractStartDate")}
            className={errors.contractStartDate ? "border-red-500" : ""}
          />
          {errors.contractStartDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.contractStartDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Contract End Date (Optional)
          </label>
          <Input type="date" {...register("contractEndDate")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Contract End Date (Optional)
          </label>
          <Input type="date" {...register("contractEndDate")} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Services Offered
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watchedServices?.includes(service) || false}
                onChange={() => handleServiceToggle(service)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
        {errors.services && (
          <p className="mt-1 text-xs text-red-600">{errors.services.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Specializations
          </label>
          <Input
            value={watch("specializations")?.join(", ") || ""}
            onChange={(e) => handleSpecializationsChange(e.target.value)}
            placeholder="Enter specializations (comma-separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Certifications
          </label>
          <div className="grid">
            <div className="flex flex-wrap gap-2 border p-2 rounded">
              {/* Badges */}
              {certifications.map((cert, idx) => (
                <Badge
                  key={idx}
                  className="px-2 py-1 rounded flex items-center gap-1"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(idx)}
                    className="ml-1 font-bold"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            {/* Input */}
            <Input
              type="text"
              className="flex-1 min-w-[120px] border-none focus:ring-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type and press , or Enter"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : partner ? "Update Partner" : "Add Partner"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default LogisticsPartnerForm;
