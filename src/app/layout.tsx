import "./globals.css";
import { ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="p-6 space-y-4">
        <Breadcrumb />
        {children}
      </body>
    </html>
  );
}
