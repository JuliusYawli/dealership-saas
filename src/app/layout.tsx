import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealership SaaS",
  description: "Inventory and workflow SaaS for car dealerships"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
