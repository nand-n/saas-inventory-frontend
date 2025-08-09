"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/commons/toastProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
// import { handleApiError } from "@/lib/utils";
import useAuthStore from "@/store/auth/auth.store";
import useUserStore from "@/store/users/user.store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  //   const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email,
      password,
      rememberMe: false,
    };

    try {
      const response = await axiosInstance.post("/auth/login", data);
      setAuth({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        tokenExpires: response.data.tokenExpires,
        tenantId: response.data.tenantId,
      });

      useUserStore.getState().setUser(response.data.user);

      document.cookie = `authToken=${response.data.token}; path=/; ${
        data.rememberMe ? `max-age=${30 * 24 * 60 * 60}` : ""
      }`;

      //   showToast("default", "Success!", "Login successful!");
      router.push("/superadmin/dashboard/overview");
    } catch (error) {
      //   showToast("destructive", handleApiError(error), "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center border-b">
            Welcome back super admin
          </CardTitle>

          <CardTitle className="text-xl font-bold text-center">
            Sign in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
