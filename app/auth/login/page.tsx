'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon } from '@heroicons/react/16/solid';
import { Toast, ToastDescription, ToastTitle, ToastViewport, ToastClose } from "@/components/ui/toast";
import { handleApiError } from '@/lib/utils';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { GradientBackground } from '@/components/gradient';
import { Mark } from '@/components/logo';
import useAuthStore from '@/store/auth/auth.store';
import useUserStore from '@/store/users/user.store';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional()
});

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ 
    title: string; 
    description: string; 
    variant: 'default' | 'destructive' 
  }>({
    title: '',
    description: '',
    variant: 'default'
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    setToastMessage({ title, description, variant });
    setToastOpen(true);
  };

  const {setAuth} = useAuthStore();


const router = useRouter();
const onSubmit = async (data: any) => {
  try {
    setIsSubmitting(true);
    const response = await axiosInstance.post('/auth/login', data);
      console.log(response ,"response");
    // Update stores
    // useAuthStore.getState().setAuth({
    //   token: response.data.token,
    //   refreshToken: response.data.refreshToken,
    //   tokenExpires: response.data.tokenExpires,
    //   tenantId: response.data.tenantId
    // });

    setAuth({
     token: response.data.token,
      refreshToken: response.data.refreshToken,
      tokenExpires: response.data.tokenExpires,
      tenantId: response.data.tenantId
    });
  
    useUserStore.getState().setUser(response.data.user);
    
    // Set cookie
    document.cookie = `authToken=${response.data.token}; path=/; ${
      data.rememberMe ? `max-age=${30 * 24 * 60 * 60}` : ''
    }`;

    showToast('Success', 'Login successful!');
    // Redirect logic
    router.push('/dashboard/overview');
  } catch (error) {
    showToast('Error', handleApiError(error), 'destructive');
  } finally {
    setIsSubmitting(false);
  }
};
  return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* <GradientBackground /> */}

            <div className="flex items-start">
            <Link href="/" title="Home">
                 <Mark className="h-9 fill-black" />
               </Link>
             </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      {...register('rememberMe')}
                      className="group block size-4 rounded-sm border border-transparent ring-1 shadow-sm ring-black/10 focus:outline-hidden data-checked:bg-black data-checked:ring-black data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black"
                    >
                      <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
                    </Checkbox>
                    <Label htmlFor="rememberMe">Remember me</Label>
                  </div>

                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium hover:text-gray-600"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="font-medium hover:text-gray-900"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Toast Component */}
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
        <ToastViewport />
      </div>
  );
}