import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Tajawal } from "next/font/google";

// Configure the font
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Aqarsas",
  description: "Aqarsas map implementation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body className="antialiased">
        <main>
          <div className="flex">
            <Sidebar />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
