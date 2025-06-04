// BlueprintData type for blueprints
export interface BlueprintData {
  platform: {
    name: string;
    tagline: string;
    description: string;
  };
  market_feasibility_analysis: {
    overall_score: number;
    metrics: Array<{ label: string; score: number; description?: string }>;
  };
  suggested_improvements: string[];
  core_features: Array<{ name: string; description: string }>;
  technical_requirements: {
    recommended_expertise_level: string;
    development_timeline: string;
    team_size: string;
    suggested_tech_stack: {
      frontend: Record<string, string>;
      backend: Record<string, string>;
      infrastructure: Record<string, string>;
    };
  };
  revenue_model: {
    primary_streams: string[];
    pricing_structure: string;
  };
  recommended_pricing_plans: Array<{
    name: string;
    price: string;
    target: string;
    features: string[];
    limitations?: string[];
    additional_benefits?: string[];
    premium_features?: string[];
    tag?: string;
    highlight?: boolean;
  }>;
  competitive_advantages: string[];
  potential_challenges: string[];
  success_metrics: string[];
} 