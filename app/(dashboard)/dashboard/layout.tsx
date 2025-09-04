import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApplicationLayout } from "./dashbaord-layout";
import Sidebar from "@/components/ui/commons/Sidebar";
import Header from "@/components/ui/commons/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS | Bussiness Authomation",
  description: "SaaS | Bussiness Authomation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    <>
      {/* <ApplicationLayout>{children}</ApplicationLayout> */}
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </>

    //   </body>
    // </html>
  );
}
