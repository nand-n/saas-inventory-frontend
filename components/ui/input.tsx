import * as Form from "@radix-ui/react-form";
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, ...props }, ref) => {
    return (
      <Form.Field name={name}>
        <Form.Label className="block text-sm font-medium mb-1">
          {label}
        </Form.Label>
        <Form.Control>
          <input
            ref={ref}
            {...props}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Control>
      </Form.Field>
    );
  }
);

// RegularInput.tsx (for non-form inputs)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
          ref={ref}
          {...props}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }
);