import type { Metadata } from "next";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full  h-full">
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
