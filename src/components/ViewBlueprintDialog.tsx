'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { BlueprintData } from '@/types/blueprint';

interface ViewBlueprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blueprint: BlueprintData | null;
  isLoading: boolean;
}

export function ViewBlueprintDialog({ open, onOpenChange, blueprint, isLoading }: ViewBlueprintDialogProps) {
  const sections = blueprint ? [
      {
          title: "Platform Overview",
          icon: <span className="text-3xl">🌌</span>,
          content: (
              <p className="text-muted-foreground">
                  <strong className="block mb-1 text-primary">{blueprint.platform.tagline}</strong>
                  {blueprint.platform.description}
              </p>
          )
      },
    {
      title: "Market Feasibility Analysis",
      icon: <span className="text-3xl text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-200">📊</span>,
      customHeader: (
        <span className="ml-auto bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-xl text-base font-bold shadow-inner transition-colors">
          Overall Score <span className="text-indigo-400">{blueprint.market_feasibility_analysis.overall_score.toFixed(1)}/10</span>
        </span>
      ),
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          {blueprint.market_feasibility_analysis.metrics.map((metric) => (
            <div key={metric.label} className="bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg p-5 flex flex-col gap-3 border border-zinc-700 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex justify-between items-center text-base font-medium text-zinc-300">
                <span className="font-bold text-white">{metric.label}</span>
                <span className="font-extrabold text-indigo-400">{metric.score}/10</span>
              </div>
              <div className="w-full h-3 bg-zinc-700/80 rounded-full overflow-hidden shadow-inner">
                <div className="h-3 rounded-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${metric.score * 10}%` }}></div>
              </div>
              {metric.description && <p className="text-zinc-400 hover:text-zinc-300 transition-colors text-sm mt-2">{metric.description}</p>}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Suggested Improvements",
      icon: <span className="text-3xl text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-200">💡</span>,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blueprint.suggested_improvements.map((improvement, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg px-5 py-3 text-zinc-200 border border-zinc-700 hover:border-orange-500/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
              <span className="text-orange-400 text-xl flex-shrink-0 mt-1">●</span>
              <span className="text-sm sm:text-base leading-relaxed hover:text-white transition-colors">{improvement}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Core Features",
      icon: <span className="text-3xl text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-200">✅</span>,
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {blueprint.core_features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-green-400 group/feature p-2 hover:bg-zinc-700/60 rounded-md transition-all duration-200 transform hover:scale-[1.02]">
              <span className="text-xl flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform">✔️</span>
              <div>
                <strong className="text-zinc-200 group-hover/feature:text-white font-semibold text-base transition-colors">{feature.name}</strong>
                <p className="text-zinc-400 group-hover/feature:text-zinc-300 text-sm leading-relaxed mt-1">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "Technical Requirements",
      icon: <span className="text-3xl text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-200">💻</span>,
      content: (
        <>
          <div className="mb-3 text-zinc-300 text-base">
            <strong>Recommended Expertise Level:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprint.technical_requirements.recommended_expertise_level}</span>
          </div>
          <div className="mb-3 text-zinc-300 text-base">
            <strong>Development Timeline (MVP):</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprint.technical_requirements.development_timeline}</span>
          </div>
          <div className="mb-4 text-zinc-300 text-base">
            <strong>Team Size:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprint.technical_requirements.team_size}</span>
          </div>
          <div className="mb-3 text-zinc-200 text-base font-semibold">Suggested Tech Stack:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(blueprint.technical_requirements.suggested_tech_stack).map(([category, stackDetails]) => (
              <div key={category} className="bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]">
                <h4 className="text-md font-bold text-zinc-100 mb-3 capitalize">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stackDetails).map(([key, techName]) => (
                    <span key={`${category}-${key}`} className="bg-zinc-700/70 text-indigo-300 hover:bg-indigo-500/60 hover:text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 transform hover:scale-105" title={`${key.charAt(0).toUpperCase() + key.slice(1)}`}>
                      {techName as string}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      title: "Revenue Model",
      icon: <span className="text-3xl text-lime-400 group-hover:text-lime-300 group-hover:scale-110 transition-all duration-200">💰</span>,
      content: (
        <>
          <div className="mb-4 text-zinc-300 text-base">
            <strong className="text-zinc-100 block mb-2">Primary Streams:</strong>
            <ul className="list-disc list-inside ml-2 space-y-1 text-zinc-400">
              {blueprint.revenue_model.primary_streams.map((stream, idx) => (
                <li key={idx} className="hover:text-indigo-300 transition-colors"><span className="text-zinc-200">{stream}</span></li>
              ))}
            </ul>
          </div>
          <div className="text-zinc-300 text-base">
            <strong className="text-zinc-100">Pricing Structure:</strong> <span className="font-semibold text-indigo-300 hover:text-purple-300 transition-colors">{blueprint.revenue_model.pricing_structure}</span>
          </div>
        </>
      )
    },
    {
      title: "Recommended Pricing Plans",
      icon: <span className="text-3xl">💲</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {blueprint.recommended_pricing_plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`group flex flex-col rounded-lg border p-6 transition-all duration-300
                ${plan.highlight ? 'bg-primary/5 border-primary shadow-lg' : 'bg-card border-border'}`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xl font-bold text-foreground">{plan.name}</span>
                {plan.tag && 
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {plan.tag}
                  </span>
                }
              </div>
              <div className="text-4xl font-extrabold text-primary">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-3">{plan.target}</p>
              
              <strong className="text-sm text-foreground mt-2">Features:</strong>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground flex-grow">
                {plan.features.map((f, i) => ( <li key={i}>{f}</li> ))}
              </ul>

              {plan.limitations && plan.limitations.length > 0 && (
                <>
                  <strong className="text-xs font-semibold mt-4 pt-3 border-t border-border text-destructive/80">Limitations:</strong>
                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                    {plan.limitations.map((l, i) => ( <li key={`lim-${i}`}>{l}</li>))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Competitive Advantages",
      icon: <span className="text-3xl text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-200">🏆</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprint.competitive_advantages.map((advantage, idx) => (
            <li key={idx} className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{advantage}</span></li>
          ))}
        </ul>
      )
    },
    {
      title: "Potential Challenges",
      icon: <span className="text-3xl text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-all duration-200">⚠️</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprint.potential_challenges.map((challenge, idx) => (
            <li key={idx} className="hover:text-red-400 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{challenge}</span></li>
          ))}
        </ul>
      )
    },
    {
      title: "Success Metrics",
      icon: <span className="text-3xl text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-200">📈</span>,
      content: (
        <ul className="list-disc list-inside ml-2 space-y-2 text-zinc-300 text-base">
          {blueprint.success_metrics.map((metric, idx) => (
            <li key={idx} className="hover:text-emerald-300 transition-colors p-1 rounded hover:bg-zinc-700/40"><span className="text-white font-semibold">{metric}</span></li>
          ))}
        </ul>
      )
    }
  ] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-7xl h-[90vh] flex flex-col bg-card text-card-foreground p-0 rounded-lg">
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {isLoading ? 'Generating...' : `Blueprint: ${blueprint?.platform.name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
          
          {!isLoading && blueprint && sections.map(section => (
            <div key={section.title} className="rounded-lg border bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                {section.customHeader}
              </div>
              {section.content}
            </div>
          ))}
        </div>

        <DialogFooter className="p-4 border-t flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <Button variant="outline">Start Over</Button>
          <Button>Approve Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}