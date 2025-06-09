'use client';

import React, { useState, useEffect } from 'react';
import type { BlueprintData } from '@/types/blueprint';
import { Loader2, Lightbulb, CheckCircle, BarChart, Gem, Target, Banknote, Trophy, AlertTriangle, ListChecks, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface BlueprintDisplayProps {
  projectId: string;
}

// A simple loading skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted/60 animate-pulse rounded-md ${className}`} />
);

// Section component for consistent layout
const Section = ({ title, icon, children, customHeader }: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  customHeader?: React.ReactNode 
}) => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
    <div className="flex items-center gap-4 p-4 sm:p-6 border-b">
      <div className="w-8 h-8 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {customHeader}
    </div>
    <div className="p-4 sm:p-6 text-sm sm:text-base">
      {children}
    </div>
  </div>
);

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
    return <div className="flex justify-center items-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>;
  }

  if (!blueprint) {
    return <div className="text-muted-foreground text-center p-8">No blueprint data available.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Platform Overview */}
      <div className="p-6 rounded-lg bg-muted/50 border">
        <h2 className="text-3xl font-bold text-foreground">{blueprint.platform.name}</h2>
        <p className="text-lg text-primary mt-1">{blueprint.platform.tagline}</p>
        <p className="text-muted-foreground mt-4">{blueprint.platform.description}</p>
      </div>
      
      {/* Market Feasibility Analysis */}
      <Section 
        title="Market Feasibility Analysis" 
        icon={<BarChart />}
        customHeader={
          <span className="ml-auto bg-muted px-4 py-2 rounded-xl text-sm font-medium">
            Overall Score <span className="text-primary">{blueprint.market_feasibility_analysis.overall_score.toFixed(1)}/10</span>
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blueprint.market_feasibility_analysis.metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>{metric.label}</span>
                <span className="text-primary">{metric.score}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${metric.score * 10}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </Section>
      
      {/* Suggested Improvements */}
      <Section title="Suggested Improvements" icon={<Lightbulb />}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {blueprint.suggested_improvements.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary mt-1">▪</span>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Core Features */}
      <Section title="Core Features" icon={<CheckCircle />}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {blueprint.core_features.map((feature, i) => (
            <li key={i}>
              <p className="font-semibold text-foreground">{feature.name}</p>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </li>
          ))}
        </ul>
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
      <Section title="Recommended Pricing Plans" icon={<Banknote />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprint.recommended_pricing_plans.map(plan => (
            <div key={plan.name} className={`rounded-lg p-6 flex flex-col border transition-all ${plan.highlight ? 'border-primary shadow-lg bg-primary/5' : 'bg-card'}`}>
              {plan.tag && <p className="text-xs font-semibold text-primary mb-2">{plan.tag}</p>}
              <h4 className="font-bold text-xl text-foreground">{plan.name}</h4>
              <p className="text-3xl font-extrabold text-foreground my-3">{plan.price}</p>
              <p className="text-sm text-muted-foreground mb-4 h-10">{plan.target}</p>
              <ul className="space-y-2 text-sm text-muted-foreground text-left flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500"/>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.limitations && plan.limitations.length > 0 && (
                <>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-destructive mb-2">Limitations</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
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
    </div>
  );
}