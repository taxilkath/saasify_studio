import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ThemeProvider } from "@/components/ThemeProvider"; // Import the new ThemeProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Studio",
  description: "Generate SaaS Blueprints with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        // Remove baseTheme: dark from here to let the ThemeProvider control it
        variables: { colorPrimary: '#6366f1' },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Wrap everything in the ThemeProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-zinc-100">
              <Navbar />
              <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}