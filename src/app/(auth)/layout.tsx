import type { Metadata } from "next";

// This metadata will be applied to all pages in the (auth) group
export const metadata: Metadata = {
  title: "AI Studio | Login",
  description: "Sign in or create an account for AI Studio.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The ClerkProvider is already in the root layout, so we just need to render the children here.
  return <>{children}</>;
}