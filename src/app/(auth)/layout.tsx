import type { Metadata } from "next";

// This metadata will be applied to all pages in the (auth) group
export const metadata: Metadata = {
  title: "SaaSify Studio | Authentication ",
  description: "Sign in or create an account to begin architecting your next SaaS.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The ClerkProvider is already in the root layout, so we just need to render the children here.
  return <>{children}</>;
}