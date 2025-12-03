import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Panel - JobMilegi.in",
  description: "Admin panel for managing job notifications",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
