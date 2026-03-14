import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StoreProvider from "@/components/StoreProvider";
import { getConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const { orgName } = getConfig();
  return {
    title: orgName,
    description: `AI operations command center — ${orgName}`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { orgName, orgInitials, isConfigured } = getConfig();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          {isConfigured ? (
            <>
              <Sidebar orgName={orgName} orgInitials={orgInitials} />
              <div className="ml-[220px] min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6">{children}</main>
              </div>
            </>
          ) : (
            <main>{children}</main>
          )}
        </StoreProvider>
      </body>
    </html>
  );
}
