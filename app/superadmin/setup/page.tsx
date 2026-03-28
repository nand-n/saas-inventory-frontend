'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toast, ToastDescription, ToastTitle, ToastProvider, ToastClose } from "@/components/ui/toast";
import { handleApiError } from '@/lib/utils';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(1, "Phone number is required"),
});

export default function SuperAdminSetup() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant: 'default' | 'destructive' }>({
        title: '',
        description: '',
        variant: 'default'
    });
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    });

    const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
        setToastMessage({ title, description, variant });
        setToastOpen(true);
    };

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            await axiosInstance.post('/auth/setup', data);
            showToast('Success', 'SuperAdmin setup complete! Redirecting to login...');
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (error) {
            showToast('Error', handleApiError(error), 'destructive');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Initial Setup</CardTitle>
                        <CardDescription className="text-center">
                            Create the first SuperAdmin account for your platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Enter first name"
                                        {...register('firstName')}
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm font-medium text-destructive">{errors.firstName.message as string}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Enter last name"
                                        {...register('lastName')}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm font-medium text-destructive">{errors.lastName.message as string}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm font-medium text-destructive">{errors.email.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm font-medium text-destructive">{errors.password.message as string}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+1 (555) 000-0000"
                                    {...register('phone')}
                                />
                                {errors.phone && (
                                    <p className="text-sm font-medium text-destructive">{errors.phone.message as string}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

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
        </div>
    );
}
