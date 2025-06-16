'use client';

import React, { useState, useEffect } from 'react';
import type { BlueprintData } from '@/types/blueprint';
import { Loader2, Lightbulb, CheckCircle, BarChart, Gem, Target, Banknote, Trophy, AlertTriangle, ListChecks, CheckCircle2, Sparkles, Rocket, Zap, Star, Crown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface BlueprintDisplayProps {
  projectId: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted/50 animate-pulse rounded-md ${className}`} />
);

const BlueprintSkeleton = () => (
    <div className="space-y-8">
      <div className="p-6 rounded-lg bg-muted/50 border">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4 mt-2" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4 p-4 sm:p-6 border-b">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="p-4 sm:p-6 grid gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
} as const;

const Section = ({ title, icon, children, customHeader }: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  customHeader?: React.ReactNode 
}) => (
  <motion.div 
    className="rounded-xl border bg-gradient-to-br from-card to-card/80 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm"
    variants={itemVariants}
    whileHover={{ scale: 1.01 }}
  >
    <div className="flex items-center gap-4 p-4 sm:p-6 border-b bg-muted/10">
      <div className="w-8 h-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
        {title}
        <Sparkles className="w-4 h-4 text-yellow-500/70 animate-pulse" />
      </h3>
      {customHeader}
    </div>
    <div className="p-4 sm:p-6 text-sm sm:text-base">
      {children}
    </div>
  </motion.div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

export default function BlueprintDisplay({ projectId }: BlueprintDisplayProps) {
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch blueprint');
        }
        setBlueprint(result.data.blueprint.content);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return <BlueprintSkeleton />;
  }

  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>;
  }

  if (!blueprint) {
    return <div className="text-muted-foreground text-center p-8">No blueprint data available.</div>;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Platform Overview */}
      <motion.div 
        variants={itemVariants}
        className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border shadow-inner relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:[mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Blueprint Overview ✨
            </div>
          </div>
          <h2 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
            {blueprint.platform.name}
            <Crown className="w-8 h-8 text-yellow-500/70" />
          </h2>
          <p className="text-xl text-primary mt-1 font-medium">{blueprint.platform.tagline}</p>
          <p className="text-muted-foreground mt-4 max-w-3xl">{blueprint.platform.description}</p>
        </div>
      </motion.div>
      
      {/* Market Feasibility Analysis */}
      <Section 
        title="Market Analysis 📊" 
        icon={<BarChart />}
        customHeader={
          <div className="ml-auto flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Score: <span className="font-bold text-primary text-base">{blueprint.market_feasibility_analysis.overall_score.toFixed(1)}/10</span></span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blueprint.market_feasibility_analysis.metrics.map((metric) => (
            <motion.div 
              key={metric.label} 
              className="space-y-2 p-4 rounded-xl bg-muted/5 hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between font-medium">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {metric.label}
                </span>
                <span className="text-primary font-bold">{metric.score}/10</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary/80 to-primary h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.score * 10}%` }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* Suggested Improvements */}
      <Section title="Suggested Improvements" icon={<Lightbulb />}>
        <motion.ul 
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.2}}
        >
          {blueprint.suggested_improvements.map((item, i) => (
            <motion.li key={i} className="flex items-start gap-3" variants={itemVariants}>
              <span className="text-primary mt-1">▪</span>
              <span className="text-muted-foreground">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Core Features */}
      <Section title="Core Features" icon={<CheckCircle />}>
        <motion.ul 
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.2}}
        >
          {blueprint.core_features.map((feature, i) => (
            <motion.li key={i} variants={itemVariants}>
              <p className="font-semibold text-foreground">{feature.name}</p>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Technical Requirements */}
      <Section title="Technical Requirements" icon={<Target />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Expertise Level</p>
              <p className="font-medium">{blueprint.technical_requirements.recommended_expertise_level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timeline (MVP)</p>
              <p className="font-medium">{blueprint.technical_requirements.development_timeline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="font-medium">{blueprint.technical_requirements.team_size}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Tech Stack</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(blueprint.technical_requirements.suggested_tech_stack).map(([category, stackDetails]) => (
                <div key={category} className="rounded-lg border p-4">
                  <h5 className="font-medium mb-2 capitalize">{category}</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stackDetails).map(([key, techName]) => (
                      <span key={`${category}-${key}`} className="bg-muted px-2 py-1 rounded-full text-xs">
                        {techName as string}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Revenue Model */}
      <Section title="Revenue Model" icon={<Gem />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Primary Streams</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {blueprint.revenue_model.primary_streams.map((stream, idx) => (
                <li key={idx}>{stream}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Pricing Structure</h4>
            <p className="text-muted-foreground">{blueprint.revenue_model.pricing_structure}</p>
          </div>
        </div>
      </Section>

      {/* Recommended Pricing Plans */}
      <Section title="Pricing Plans 💎" icon={<Banknote />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.recommended_pricing_plans.map(plan => (
            <motion.div 
              key={plan.name} 
              className={`rounded-xl p-6 flex flex-col border transition-all duration-300 
                ${plan.highlight 
                  ? 'border-primary shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' 
                  : 'bg-card hover:bg-primary/5'}`}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {plan.tag && (
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                  <Crown className="w-4 h-4" />
                  {plan.tag}
                </div>
              )}
              <h4 className="font-bold text-xl text-foreground">{plan.name}</h4>
              <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 my-3">
                {plan.price}
              </p>
              <p className="text-sm text-muted-foreground mb-4 h-10">{plan.target}</p>
              <ul className="space-y-2 text-sm text-muted-foreground text-left flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-primary"/>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.limitations && plan.limitations.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-destructive mb-2">Limitations</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive/70" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Competitive Advantages */}
      <Section title="Competitive Advantages" icon={<Trophy />}>
        <ul className="space-y-2">
          {blueprint.competitive_advantages.map((advantage, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-1">▪</span>
              <span className="text-muted-foreground">{advantage}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Potential Challenges */}
      <Section title="Potential Challenges" icon={<AlertTriangle />}>
        <ul className="space-y-2">
          {blueprint.potential_challenges.map((challenge, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-destructive mt-1">▪</span>
              <span className="text-muted-foreground">{challenge}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Success Metrics */}
      <Section title="Success Metrics" icon={<ListChecks />}>
        <ul className="space-y-2">
          {blueprint.success_metrics.map((metric, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-1">▪</span>
              <span className="text-muted-foreground">{metric}</span>
            </li>
          ))}
        </ul>
      </Section>
    </motion.div>
  );
}