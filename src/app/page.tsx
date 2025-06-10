// src/app/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Rocket, ArrowRight, Check, Cpu, GitMerge, LayoutGrid, Bot, Code, Users } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#111] text-zinc-800 dark:text-zinc-200 overflow-x-hidden">
      {/* Aurora background is hidden in light mode for a cleaner look */}
      <div className="fixed inset-0 z-0 opacity-20 hidden dark:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4a00e0,transparent_40%)] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_100%_100%,#8e2de2,transparent_40%)] opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_0%_0%,#4a00e0,transparent_40%)] opacity-30 animate-pulse-slow-reverse"></div>
      </div>
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <ShowcaseSection />
          <FeaturesSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}


// --- Page Sections & Sub-components ---

const navLinks = [
  { name: 'Showcase', href: '#showcase' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
];

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <Link href="#" className="flex items-center gap-2 group">
          <div className="p-2 bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-white/20 transition-all">
            <Rocket className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
          </div>
          <span className="text-lg font-bold tracking-wider text-zinc-900 dark:text-zinc-100">SaaSify</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitcher />
          <Button variant="ghost" asChild className="hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hidden sm:flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="group relative overflow-hidden bg-zinc-900 text-white dark:bg-white dark:text-black font-bold shadow-2xl transition-all duration-300 hover:scale-105">
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </header>
);

const HeroSection = () => {
    const FADE_UP_ANIMATION_VARIANTS = {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
    };
  
    return (
      <section className="pt-40 pb-24 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl sm:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 mb-6">
            Your Next SaaS, <br /> Instantly Architected.
          </motion.h1>
          <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 mb-10">
            Stop the guesswork. SaaSify Studio transforms your raw ideas into market-validated, developer-ready blueprints with the power of AI.
          </motion.p>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-2xl shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 px-6 py-3">
              <Link href="/dashboard">
                Build Your Blueprint
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    );
  };
  

const InteractiveCard = ({ children, className }) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);
  
    function handleMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
  
    return (
      <motion.div
        onMouseMove={handleMouseMove}
        className={`group relative w-full h-full bg-white/50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-lg ${className}`}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(400px at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.1), transparent 80%)
            `,
          }}
        />
        {children}
      </motion.div>
    );
  };
  

const ShowcaseSection = () => (
    <section id="showcase" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <InteractiveCard className="p-8 h-[500px] flex flex-col justify-center items-center text-center shadow-2xl">
                <h2 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4">Visualize Your Entire Architecture</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">From user flows to Kanban boards, every piece of your plan is generated and displayed in a unified, interactive studio.</p>
                <div className="mt-8 w-full max-w-4xl h-64 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg shadow-inner flex items-center justify-center p-4">
                     <p className="text-zinc-400 dark:text-zinc-600">[ A complex, animated diagram or app screenshot would be displayed here ]</p>
                </div>
            </InteractiveCard>
        </div>
    </section>
);
  

const FeaturesSection = () => (
    <section id="features" className="py-24 bg-zinc-100 dark:bg-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">The Future of Project Planning</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">AI-powered insights that give you an unfair advantage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: 'AI Blueprint Generation', description: 'Complete plans including market analysis, feature lists, and competitor insights.' },
            { icon: GitMerge, title: 'Visual User Flows', description: 'Instantly visualize your application architecture and user journeys with generated diagrams.' },
            { icon: LayoutGrid, title: 'Interactive Kanban Board', description: 'Core features are automatically converted into actionable tickets on a drag-and-drop board.' },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
            >
              <InteractiveCard className="p-8 h-full">
                <feature.icon className="w-10 h-10 text-indigo-600 dark:text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

const PricingSection = () => (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">Find the Right Plan</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Start for free, upgrade when you're ready to scale.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            plan="Creator"
            price="$0"
            description="For individuals and hobbyists exploring new ideas."
            features={['3 Blueprint Generations', 'Core Feature Analysis', 'Basic Tech Stack', 'Community Support']}
            ctaText="Start Creating"
          />
          <PricingCard
            plan="Pro"
            price="$29"
            isFeatured
            description="For professionals and teams building the next big thing."
            features={[ 'Unlimited Blueprints', 'Advanced Market Analysis', 'User Flow & Kanban Boards', 'AI Agent Integration', 'Priority Support' ]}
            ctaText="Go Pro"
          />
        </div>
      </div>
    </section>
  );
  
const PricingCard = ({ plan, price, description, features, ctaText, isFeatured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: isFeatured ? 0.2 : 0.1 }}
      className={`relative p-8 h-full flex flex-col rounded-2xl border ${isFeatured ? 'border-purple-500 bg-white dark:bg-zinc-900 shadow-2xl shadow-purple-500/10' : 'bg-white/50 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/5'}`}
    >
      <div className="flex-grow">
        {isFeatured && (
          <div className="absolute top-0 -translate-y-1/2 left-8">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">Most Popular</span>
          </div>
        )}
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{plan}</h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
        <div className="mt-6">
          <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">{price}</span>
          {price !== '$0' && <span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span>}
        </div>
        <ul className="mt-8 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-500 flex-shrink-0" />
              <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <Button asChild size="lg" className={`w-full font-bold transition-transform transform hover:scale-105 group relative overflow-hidden ${isFeatured ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200'}`}>
          <Link href="/dashboard">{ctaText}</Link>
        </Button>
      </div>
    </motion.div>
  );

const Footer = () => (
    <footer className="border-t border-zinc-200 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">&copy; {new Date().getFullYear()} SaaSify Studio. Built for the future.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Terms</Link>
            <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );