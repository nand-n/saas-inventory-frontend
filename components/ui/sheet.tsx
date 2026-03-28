"use client";

import * as React from "react";

interface SheetProviderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function SheetProvider({ open, onOpenChange, children }: SheetProviderProps) {
  React.useEffect(() => {
    // noop placeholder for portal management
  }, [open]);
  return <div data-open={open}>{children}</div>;
}

interface SheetContentProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "default" | "sm" | "lg" | "xl" | "full";
  className?: string;
}

export const SheetContent: React.FC<SheetContentProps> = ({ children, side = "right", size = "default", className = "" }) => {
  return (
    <div className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-full max-w-md bg-background shadow-lg transition-transform duration-300 z-[100] ${className}`}>
      {children}
    </div>
  );
};

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function SheetClose() {
  return null;
}


