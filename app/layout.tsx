import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monaax — Order Tracker",
  description: "Daily jewelry order tracking for Monaax",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <html lang="en">
      <body className={inter.className}>
        {user && (
          <Sidebar
            userName={user.name ?? user.email ?? ""}
            userEmail={user.email ?? ""}
          />
        )}
        <main className={user ? "ml-60 min-h-screen p-6 lg:p-8" : "min-h-screen"}>
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
