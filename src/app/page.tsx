// src/app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Shapes, ArrowRight, Zap, Terminal, Check, Cpu, GitMerge, LayoutGrid, Bot, Code, Users, BrainCircuit, ShieldCheck, Github, BarChart3, Workflow, KanbanSquare, X } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { UserFlowDialog } from '@/components/UserFlowDialog';
import type { Node, Edge } from 'reactflow';
import type { CustomNodeData } from '@/components/UserFlowDialog';
import InteractiveKanban from '@/components/InteractiveKanban'; // <-- Import the new component
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-zinc-800 dark:text-zinc-200 overflow-x-hidden">
      {/* Modern Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0D081F] dark:via-black dark:to-[#1C0D25]"></div>
        <div className="absolute top-0 left-0 h-[50vh] w-[50vw] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,_rgba(167,139,250,0.2),_transparent_70%)] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 h-[50vh] w-[50vw] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_70%)] animate-pulse-slow-reverse"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ShowcaseSection />
          <DeveloperSection />
          <HowItWorksSection />
          <OpenSourceSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
const AnimatedTerminal = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: 'npx saasify-studio create', duration: 2000 },
    { text: '✔ Project "Prodigies University" initialized.', duration: 1500 },
    { text: '✔ Memory Bank synced with AI Agent.', duration: 2000 },
    { text: '🤖 Listening for file changes...', duration: 99999 },
  ];

  useEffect(() => {
    if (step >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setStep(step + 1);
    }, steps[step].duration);
    return () => clearTimeout(timer);
  }, [step, steps]);

  return (
    <div className="bg-zinc-900/80 p-4 rounded-lg font-mono text-sm border border-white/10 shadow-lg h-full">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="text-zinc-300">
        {steps.slice(0, step + 1).map((s, i) => (
          <p key={i} className="flex items-center">
            <span className="text-purple-400 mr-2">$</span>
            <span className={i === steps.length - 1 && step < steps.length - 1 ? 'animate-pulse' : ''}>
              {s.text}{i === step && step < steps.length - 1 && "▌"}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
              See How It Works
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Go from a simple idea to a fully-realized project blueprint in under a minute. Watch the tour to see how.
            </p>
          </div>

          {/* Video Player with App Frame */}
          <motion.div
            whileInView={{
              boxShadow: "0 0 40px 10px rgba(138, 92, 246, 0.15)"
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-4xl mx-auto bg-zinc-900/50 rounded-xl border border-white/10 shadow-2xl shadow-purple-500/10 backdrop-blur-sm overflow-hidden"
          >
            {/* Window Header */}
            <div className="h-10 bg-zinc-800/80 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
            </div>

            {/* Video */}
            <div className="p-2">
              <video
                controls
                poster="/tour-poster.png" // Your video thumbnail
                className="w-full rounded-md"
              >
                <source src="/videos/software-tour.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
const DeveloperSection = () => (
  <section id="developers" className="py-24 bg-black/20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-sm mb-4 border border-purple-500/20">
              <Bot className="w-5 h-5" />
              For Developers
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white mb-4">
              From CLI to Co-pilot
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              SaaSify Studio integrates seamlessly into your workflow. Use the CLI for quick actions and let the MCP Agent keep your AI co-pilot perfectly in sync with your project's context.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg"><Terminal className="w-5 h-5 text-green-400" /></div>
                <div>
                  <h4 className="font-semibold text-white">CLI Integration</h4>
                  <p className="text-zinc-400">Manage projects and sync blueprints right from your terminal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg"><BrainCircuit className="w-5 h-5 text-sky-400" /></div>
                <div>
                  <h4 className="font-semibold text-white">Memory Bank Sync</h4>
                  <p className="text-zinc-400">Automatically provides your AI agent with the latest project context.</p>
                </div>
              </div>
            </div>
            
            {/* Coming Soon Badge */}
            <div className="mt-8 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-full text-sm border border-indigo-500/20 animate-pulse">
              <Workflow className="w-5 h-5" />
              <span className="font-semibold">Coming Soon</span>
              <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs">Q2 2024</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Animated Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <AnimatedTerminal />
        </motion.div>
      </div>
    </div>
  </section>
);
const initialNodes: Node<CustomNodeData>[] = [
  { id: "1", type: "customNode", position: { x: 0, y: 200 }, data: { title: "Platform Entry", description: "Admin or Employee signs up/logs in", checklist: [{ "label": "Admin Registration/Login", "status": "done" }, { "label": "Employee Onboarding (via invite)", "status": "done" }, { "label": "Profile Setup & Preferences", "status": "in-progress" }] } },
  { id: "2", type: "customNode", position: { x: 400, y: 0 }, data: { title: "Admin Dashboard", description: "Central hub for culture management", checklist: [{ "label": "Team Management", "status": "done" }, { "label": "Integration Setup", "status": "done" }, { "label": "Analytics & Reporting", "status": "in-progress" }] } },
  { id: "3", type: "customNode", position: { x: 400, y: 400 }, data: { title: "Employee Dashboard", description: "Personalized view for engagement", checklist: [{ "label": "Upcoming Activities", "status": "done" }, { "label": "Recognition Feed", "status": "in-progress" }, { "label": "Mental Health Check-in", "status": "pending" }] } },
  { id: "4", type: "customNode", position: { x: 800, y: -100 }, data: { title: "Activity Management", description: "Admin creates/schedules activities", checklist: [{ "label": "Browse Activity Library", "status": "done" }, { "label": "Schedule Automated Activity", "status": "done" }, { "label": "Review AI Suggestions", "status": "in-progress" }] } },
  { id: "5", type: "customNode", position: { x: 800, y: 200 }, data: { title: "Recognition System", description: "Sending and viewing recognition", checklist: [{ "label": "Send Peer-to-Peer Recognition", "status": "done" }, { "label": "View Recognition History", "status": "pending" }] } },
  { id: "6", type: "customNode", position: { x: 800, y: 500 }, data: { title: "Well-being Check-ins", description: "Employee conducts check-ins", checklist: [{ "label": "Daily Mood Check", "status": "done" }, { "label": "Access Resource Library", "status": "in-progress" }] } },
  { id: "7", type: "customNode", position: { x: 1200, y: 200 }, data: { title: "AI Recommendation Engine", description: "Generates personalized suggestions", checklist: [{ "label": "Process Preferences", "status": "done" }, { "label": "Analyze Schedules", "status": "in-progress" }, { "label": "Generate Suggestions", "status": "pending" }] } }
];
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, label: "Admin Path" },
  { id: "e1-3", source: "1", target: "3", animated: true, label: "Employee Path" },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e2-5", source: "2", target: "5", animated: true },
  { id: "e3-6", source: "3", target: "6", animated: true },
  { id: "e4-7", source: "4", target: "7", animated: true },
  { id: "e5-7", source: "5", target: "7", animated: true },
  { id: "e6-7", source: "6", target: "7", animated: true }
];

const AnimatedBlueprint = () => {
  const code = `
{
  "platform": {
    "name": "AI-Powered Task Manager",
    "tagline": "Intelligent Task Management..."
  },
  "market_feasibility_analysis": {
    "overall_score": 8.5,
    "metrics": [...]
  }
}
  `.trim();

  const [displayedCode, setDisplayedCode] = useState('');

  useEffect(() => {
    setDisplayedCode('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedCode(code.substring(0, i));
      i++;
      if (i > code.length) {
        clearInterval(intervalId);
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [code]);

  return (
    <pre className="text-xs sm:text-sm bg-black/50 p-4 rounded-lg overflow-hidden border border-white/10 shadow-inner">
      <code className="text-purple-300">{displayedCode}</code>
      <span className="animate-ping">▌</span>
    </pre>
  );
}

const ShowcaseSection = () => {
  const [isUserFlowOpen, setUserFlowOpen] = useState(false);

  return (
    <>
      <section id="showcase" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">An Entire SaaS Plan, Visualized</h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">From abstract ideas to concrete architecture, see your entire project come to life in seconds.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* AI Blueprint Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } } }}
              className="md:col-span-2"
            >
              <InteractiveCard className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Cpu className="w-8 h-8 text-indigo-500 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">AI-Generated Blueprint</h3>
                  </div>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">Get a comprehensive JSON blueprint covering market analysis, tech stack, feature sets, and more.</p>
                </div>
                <div className="mt-6 p-4 bg-zinc-100 dark:bg-black/50 rounded-lg border border-zinc-200 dark:border-white/10 text-left text-xs font-mono text-zinc-500 dark:text-zinc-400 overflow-hidden">
                  <AnimatedBlueprint />
                </div>
              </InteractiveCard>
            </motion.div>

            {/* --- FIX STARTS HERE --- */}
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } } }}>
              <button onClick={() => setUserFlowOpen(true)} className="w-full h-full text-left">
                <InteractiveCard className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <GitMerge className="w-8 h-8 text-indigo-500 dark:text-purple-400" />
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">User Flow Diagram</h3>
                    </div>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">Visualize complex app architecture and user journeys automatically.</p>
                  </div>
                  <div className="mt-6 h-40 relative flex items-center justify-center p-4 bg-zinc-100 dark:bg-black/50 rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle fill="currentColor" className="text-zinc-200 dark:text-white/10" cx="2" cy="2" r="1"></circle>
                      </pattern>
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
                    </svg>
                    <div className="relative w-full h-full">
                      <div className="absolute top-4 left-2 w-16 p-1 bg-white dark:bg-zinc-800 rounded-md text-xs text-center shadow">Login</div>
                      <div className="absolute top-16 left-20 w-20 p-1 bg-white dark:bg-zinc-800 rounded-md text-xs text-center shadow z-10">Dashboard</div>
                      <div className="absolute bottom-4 right-2 w-16 p-1 bg-white dark:bg-zinc-800 rounded-md text-xs text-center shadow">Settings</div>
                      <div className="absolute top-8 left-16 w-10 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                      <div className="absolute top-8 left-24 w-px h-8 bg-zinc-300 dark:bg-zinc-600"></div>
                      <div className="absolute bottom-8 right-16 w-12 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                    </div>
                  </div>
                </InteractiveCard>
              </button>
            </motion.div>
            {/* --- FIX ENDS HERE --- */}

            {/* ADVANCED Kanban Board Card */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } } }}
              className="md:col-span-3"
            >
              <InteractiveCard className="p-8 h-full">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-8 h-8 text-indigo-500 dark:text-purple-400" />
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Actionable Kanban Board</h3>
                </div>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Core features are automatically converted into detailed tickets. Drag to reorder.</p>
                <div className="mt-6">
                  <InteractiveKanban />
                </div>
              </InteractiveCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <UserFlowDialog
        open={isUserFlowOpen}
        onOpenChange={setUserFlowOpen}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </>
  );
};

const navLinks = [
  { 
    name: 'Features', 
    href: '#features',
    icon: Cpu
  },
  { 
    name: 'Showcase', 
    href: '#showcase',
    icon: LayoutGrid
  },
  { 
    name: 'Developers', 
    href: '#developers',
    icon: Code
  },
  { 
    name: 'Pricing', 
    href: '#pricing',
    icon: BarChart3
  },
  { 
    name: 'Open Source', 
    href: '#opensource',
    icon: Github
  },
];

const Header = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push(isSignedIn ? '/dashboard' : '/sign-in');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="#" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border border-zinc-200 dark:border-white/10 rounded-lg group-hover:bg-gradient-to-tr group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-300">
              <Shapes className="w-5 h-5 text-indigo-600 dark:text-purple-400 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 font-['--font-geist-mono']">
              SaaSify
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="group relative px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300" />
                  {link.name}
                </span>
                <span className="absolute inset-0 bg-zinc-100 dark:bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Button 
              variant="ghost" 
              asChild 
              className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-full group transition-all duration-300"
            >
              <Link href="/sign-in" className="flex items-center gap-2">
                <Users className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                Sign In
              </Link>
            </Button>
            <Button 
              onClick={handleGetStartedClick} 
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 rounded-full px-5 py-2"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-all duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const visuals = [
  {
    id: 'overview',
    title: 'Project Overview',
    src: '/overview.png',
    alt: 'SaaSify Studio Project Overview Dashboard',
    features: [
      'Track key metrics like total tickets and features.',
      'Visualize ticket status with progress bars.',
      'Monitor individual feature completion.',
      'Get at-a-glance project details and analysis.',
    ],
  },
  {
    id: 'userflow',
    title: 'User Flow Diagrams',
    src: '/userflow.png',
    alt: 'SaaSify Studio AI-generated User Flow Diagram',
    features: [
      'AI-generated diagrams from your project description.',
      'Visualize connections between pages and user actions.',
      'Built with interactive and customizable nodes.',
      'Easily understand your application architecture.',
    ],
  },
  {
    id: 'kanban',
    title: 'Interactive Kanban Board',
    src: '/kanban.png',
    alt: 'SaaSify Studio Interactive Kanban Board',
    features: [
      'Core features are automatically converted into tickets.',
      'Drag-and-drop tasks between columns.',
      'Manage backlog, to-do, in-progress, and completed tasks.',
      'A ready-to-use board to kickstart development.',
    ],
  },
];

const HeroVisuals = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedVisual = selectedId ? visuals.find(v => v.id === selectedId) : null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 lg:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visuals.map(visual => (
          <motion.div
            key={visual.id}
            layoutId={visual.id}
            onClick={() => setSelectedId(visual.id)}
            className="relative rounded-lg overflow-hidden cursor-pointer h-64 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Image src={visual.src} alt={visual.alt} layout="fill" objectFit="cover" objectPosition="top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">{visual.title}</h3>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVisual && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
          >
            <motion.div layoutId={selectedVisual.id} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-7xl bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">
              <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors z-10">
                <X className="w-6 h-6" />
              </button>
              <div className="w-full md:w-2/3">
                <Image src={selectedVisual.src} alt={selectedVisual.alt} width={1200} height={750} className="rounded-lg shadow-lg w-full" />
              </div>
              <div className="w-full md:w-1/3 text-left flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-white">{selectedVisual.title}</h2>
                <ul className="space-y-4">
                  {selectedVisual.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <span className="text-zinc-600 dark:text-zinc-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ... (The rest of the file remains the same)
const HeroSection = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push(isSignedIn ? '/dashboard' : '/sign-in');
  };
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
  } as const;

  return (
    <section className="pt-32 pb-24 text-center">
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
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100/80 dark:bg-white/5 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/80 dark:hover:bg-white/10 transition-colors">
            Introducing SaaSify Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="mt-6 text-5xl sm:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-purple-400 animate-background-pan mb-6">
          From Idea to Impact, <br /> Instantly Architected.
        </motion.h1>

        <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 mb-10">
          Bridge the gap between vision and execution. SaaSify Studio eliminates the friction of early-stage planning, transforming your concepts into market-validated, developer-ready blueprints in seconds.
        </motion.p>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex items-center justify-center gap-4">
          <Button onClick={handleGetStartedClick} size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 px-8 py-3 rounded-full">
            <span className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></span>
            <span className="relative flex items-center">
              Build Your Blueprint
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-20">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Backed by the world's best innovators</p>
          <div className="mt-6 flex justify-center items-center gap-x-12 gap-y-4 flex-wrap">
            {[Cpu, Bot, Code, Users, LayoutGrid].map((Icon, i) => (
              <Icon key={i} className="w-10 h-10 text-zinc-400 dark:text-zinc-600 transition-all duration-300 hover:text-zinc-600 dark:hover:text-zinc-400 hover:scale-110" />
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

const InteractiveCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`group relative w-full h-full bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 ${className}`}
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
InteractiveCard.displayName = 'InteractiveCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: Cpu,
      title: 'AI Blueprint Generation',
      description: 'Generate comprehensive blueprints with deep market analysis, strategic feature-roadmaps, and competitor intelligence.'
    },
    {
      icon: GitMerge,
      title: 'Visual User Flows',
      description: 'Instantly visualize your applications architecture and user journeys with dynamically generated diagrams.'
    },
    {
      icon: LayoutGrid,
      title: 'Interactive Kanban Board',
      description: 'Automatically convert core features into actionable development tickets on a ready-to-use board.'
    },
    {
      icon: BrainCircuit,
      title: 'Memory Bank (MCP)',
      description: 'A dedicated, project-specific context store for your AI. Ensures future iterations and suggestions are always relevant and intelligent.'
    },
    {
      icon: Code,
      title: 'Developer-Ready Output',
      description: 'From a full tech stack to ready-to-use Kanban tickets, the output is designed to be immediately actionable for your development team.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Authentication',
      description: 'User management and authentication are handled securely out-of-the-box with Clerk, letting you focus on building your product.'
    },
  ];

  return (
    <section id="features" className="py-24 bg-zinc-100 dark:bg-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">The Future of Project Planning</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">AI-powered insights that give you an unfair advantage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: i * 0.1 }}
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
};

const PricingSection = () => (
  <section id="pricing" className="py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">Find the Right Plan</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Start for free, upgrade when you're ready to scale.</p>
      </div>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
          features={['Unlimited Blueprints', 'Advanced Market Analysis', 'User Flow & Kanban Boards', 'AI Agent Integration', 'Priority Support']}
          ctaText="Go Pro"
        />
      </div>
    </div>
  </section>
);

const OpenSourceSection = () => (
  <section id="opensource" className="py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <InteractiveCard className="p-8 flex flex-col justify-center items-center text-center shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center"
        >
          <div className="mb-6 bg-zinc-100 dark:bg-white/10 p-4 rounded-full border border-zinc-200 dark:border-white/10">
            <Github className="w-10 h-10 text-zinc-800 dark:text-white" />
          </div>
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4">Proudly Open Source</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-8">
            SaaSify Studio is open source. Contribute to the project, customize it for your needs, or self-host it on your own infrastructure.
          </p>
          <Button asChild size="lg" variant="outline" className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white font-bold transition-transform transform hover:scale-105 group">
            <Link href="https://github.com/your-username/saasify-studio" target="_blank">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Link>
          </Button>
        </motion.div>
      </InteractiveCard>
    </div>
  </section>
);

const PricingCard = ({ plan, price, description, features, ctaText, isFeatured = false, ctaIcon: CtaIcon }: { plan: string, price: string, description: string, features: string[], ctaText: string, isFeatured?: boolean, ctaIcon?: React.ElementType }) => (
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
        {plan === "Pro" && <span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span>}
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
        <Link href="/dashboard">
          {CtaIcon && <CtaIcon className="w-4 h-4 mr-2" />}
          {ctaText}
        </Link>
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