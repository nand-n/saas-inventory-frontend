"use client";
import { useFormContext } from "react-hook-form";

const PermissionsForm = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Permission Name</label>
        <input {...register("permissionName", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="w-full border p-2 rounded-md" rows={3} />
      </div>
    </div>
  );
};

export default PermissionsForm;
