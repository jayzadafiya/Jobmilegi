import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "JobMilegi.in - Latest Government Job Notifications",
    template: "%s | JobMilegi.in",
  },
  description:
    "Get the latest government job notifications, admit cards, results, and answer keys from across India. Your trusted source for sarkari naukri updates.",
  keywords: [
    "government jobs",
    "sarkari naukri",
    "job notifications",
    "admit card",
    "results",
    "SSC",
    "railway jobs",
    "bank jobs",
  ],
  authors: [{ name: "JobMilegi.in Team" }],
  creator: "JobMilegi.in",
  publisher: "JobMilegi.in",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://jobmilegi.in",
    title: "JobMilegi.in - Latest Government Job Notifications",
    description:
      "Get the latest government job notifications, admit cards, results, and answer keys from across India.",
    siteName: "JobMilegi.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobMilegi.in - Latest Government Job Notifications",
    description:
      "Get the latest government job notifications from across India.",
    creator: "@jobmilegi",
  },
  alternates: {
    canonical: "https://jobmilegi.in",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
