"use client";
import { useFormContext } from "react-hook-form";

const UsersForm = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">User Name</label>
        <input {...register("username", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register("email", { required: true })} className="w-full border p-2 rounded-md" />
      </div>
    </div>
  );
};

export default UsersForm;
