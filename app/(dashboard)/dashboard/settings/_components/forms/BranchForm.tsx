"use client";
import { useFormContext } from "react-hook-form";

const BranchForm = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Branch Name</label>
        <input {...register("name", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input {...register("location")} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Latitude</label>
        <input type="number" {...register("lat", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Longitude</label>
        <input type="number" {...register("lng", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Tenant ID</label>
        <input {...register("tenantId", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
    </div>
  );
};

export default BranchForm;
