'use client';

import { SignIn } from "@clerk/nextjs";
import Image from 'next/image';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Bot, GitMerge, LayoutGrid } from 'lucide-react';
import React from "react";

// Array of features to display
const features = [
  {
    icon: <Bot className="h-5 w-5 text-indigo-400" />,
    name: 'AI Blueprint Generation',
    description: 'Instantly get market analysis, feature lists, and tech stacks.',
  },
  {
    icon: <GitMerge className="h-5 w-5 text-indigo-400" />,
    name: 'Visual User Flows',
    description: 'Visualize your application architecture and user journeys.',
  },
  {
    icon: <LayoutGrid className="h-5 w-5 text-indigo-400" />,
    name: 'Interactive Kanban Board',
    description: 'Actionable tickets are automatically created from core features.',
  },
];

export default function Page() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Branding Column */}
        <div 
          className="relative hidden lg:flex flex-col items-center justify-center gap-8 p-12 border-r border-zinc-800"
          onMouseMove={handleMouseMove}
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  450px circle at ${mouseX}px ${mouseY}px,
                  rgba(139, 92, 246, 0.1),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="flex flex-col items-center text-center z-10">
            <Image
              src="/logo.png"
              alt="AI Studio Logo"
              width={80}
              height={80}
              className="mb-4 rounded-lg"
            />
            <h1 className="text-3xl font-bold tracking-tight">AI Studio</h1>
            <p className="text-lg text-zinc-400 mt-2 max-w-sm">
              Your Next SaaS, Instantly Architected.
            </p>
          </div>
          <div className="space-y-6 z-10 w-full max-w-sm">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 transition-transform hover:scale-105 hover:border-indigo-500/50">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold">{feature.name}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="w-full max-w-md"
          >
            <SignIn
              path="/sign-in"
              afterSignInUrl="/dashboard"
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: '#6366f1',
                  colorText: '#e2e8f0',
                  colorTextSecondary: '#94a3b8',
                  colorBackground: 'transparent',
                  colorInputBackground: '#18181b',
                  colorInputText: '#e2e8f0',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'w-full shadow-none bg-transparent',
                  headerTitle: 'text-2xl font-bold text-white',
                  headerSubtitle: 'text-base text-zinc-400',
                  formFieldInput: 'rounded-lg border-zinc-700 bg-zinc-900 focus-visible:ring-2 focus-visible:ring-primary/50',
                  formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold',
                  footerActionText: 'text-zinc-400',
                  footerActionLink: 'text-primary hover:text-primary/90 font-semibold',
                  socialButtonsBlockButton: 'border-zinc-700 hover:bg-zinc-900',
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}