import type { Metadata } from "next";
import "./globals.css";
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
      <body className="font-tajawal antialiased">
        <div className="flex">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
