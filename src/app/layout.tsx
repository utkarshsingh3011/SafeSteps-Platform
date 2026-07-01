import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeSteps | Your Digital Safety Guide",
  description: "An approachable, student-friendly guide to digital safety, passwords, and scam prevention.",
};

import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cyber-bg cyber-grid text-on-surface">
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

