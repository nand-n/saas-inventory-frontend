'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toast, ToastDescription, ToastTitle, ToastViewport, ToastProvider, ToastClose } from "@/components/ui/toast";
import { handleApiError } from '@/lib/utils';
import axiosInstance from '@/lib/axiosInstance';

const formSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  numberOfBranches: z.number().min(1, "At least 1 branch required"),
  industryType: z.string().uuid("Please select an industry"),
  tenantAdmin: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
});

type IndustryType = {
  id: string;
  name: string;
};

export default function TenantRegistration() {
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' }>({
    title: '',
    description: '',
    variant: 'default'
  });

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
    resolver: zodResolver(formSchema),
  });




  // Fetch industries on mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axiosInstance.get('/industry-type');
        setIndustries(response.data);
      } catch (error) {
        showToast('Error', 'Failed to load industries', 'destructive');
      }
    };
    fetchIndustries();
  }, []);

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    setToastMessage({ title, description, variant });
    setToastOpen(true);
  };

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haG9tZGViQGdtYWlsLmNvbSIsImlhdCI6MTc0MzE0NjgwMywiZXhwIjoxNzQzMjMzMjAzfQ.4olb1rzpNHxVH_FHAcyIJkMw0mmMfNFSaJm6tvDiuqU"

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post('/tenants', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast('Success', 'Tenant registered successfully!');
    } catch (error) {
      showToast('Error', handleApiError(error), 'destructive');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Register New Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Tenant Information Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Tenant Information</h2>

                  <div className="space-y-2">
                    <Label htmlFor="name">Tenant Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter tenant name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfBranches">Number of Branches</Label>
                    <Input
                      id="numberOfBranches"
                      type="number"
                      min={1}
                      placeholder="Enter number of branches"
                      {...register('numberOfBranches', { valueAsNumber: true })}
                    />
                    {errors.numberOfBranches && (
                      <p className="text-sm font-medium text-destructive">{errors.numberOfBranches.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Select
                      onValueChange={(value) => setValue('industryType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.industryType && (
                      <p className="text-sm font-medium text-destructive">{errors.industryType.message}</p>
                    )}
                  </div>
                </div>

                {/* Admin Information Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Admin Information</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        {...register('tenantAdmin.firstName')}
                      />
                      {errors.tenantAdmin?.firstName && (
                        <p className="text-sm font-medium text-destructive">{errors.tenantAdmin.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        {...register('tenantAdmin.lastName')}
                      />
                      {errors.tenantAdmin?.lastName && (
                        <p className="text-sm font-medium text-destructive">{errors.tenantAdmin.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      {...register('tenantAdmin.email')}
                    />
                    {errors.tenantAdmin?.email && (
                      <p className="text-sm font-medium text-destructive">{errors.tenantAdmin.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      {...register('tenantAdmin.phone')}
                    />
                    {errors.tenantAdmin?.phone && (
                      <p className="text-sm font-medium text-destructive">{errors.tenantAdmin.phone.message}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register Tenant'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

         {/* Add Toast component here */}
         {toastOpen && (
          <Toast
            variant={toastMessage.variant}
            open={toastOpen}
            onOpenChange={setToastOpen}
          >
            <div className="grid gap-1">
              <ToastTitle>{toastMessage.title}</ToastTitle>
              <ToastDescription>{toastMessage.description}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        )}
      </ScrollArea>
  );
}