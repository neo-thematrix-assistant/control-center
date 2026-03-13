import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OpenClaw Mission Control",
  description: "AI operations command center powered by OpenClaw Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Sidebar />
        <div className="ml-[220px] min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
