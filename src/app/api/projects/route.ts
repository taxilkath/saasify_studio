import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';


const blueprintSchema = z.object({
  platform: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
  market_feasibility_analysis: z.object({
    overall_score: z.number(),
    metrics: z.array(z.object({
      label: z.string(),
      score: z.number(),
      description: z.string(),
    })),
  }),
  suggested_improvements: z.array(z.string()),
  core_features: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  technical_requirements: z.object({
    recommended_expertise_level: z.string(),
    development_timeline: z.string(),
    team_size: z.string(),
    suggested_tech_stack: z.object({
      frontend: z.object({
        framework: z.string(),
        library: z.string(),
        styling: z.string(),
        animations: z.string(),
        language: z.string(),
      }),
      backend: z.object({
        database: z.string(),
        orm: z.string(),
        ai_ml_framework: z.string(),
        authentication: z.string(),
        integrations_sdk: z.string(),
        task_queue: z.string(),
      }),
      infrastructure: z.object({
        hosting: z.string(),
        cdn: z.string(),
        monitoring: z.string(),
        analytics: z.string(),
        logging: z.string(),
      }),
    }),
  }),
  revenue_model: z.object({
    primary_streams: z.array(z.string()),
    pricing_structure: z.string(),
  }),
  recommended_pricing_plans: z.array(z.object({
    name: z.string(),
    price: z.string(),
    target: z.string(),
    features: z.array(z.string()),
    limitations: z.array(z.string()).optional(),
    tag: z.string().optional(),
    additional_benefits: z.array(z.string()).optional(),
    premium_features: z.array(z.string()).optional(),
  })),
  competitive_advantages: z.array(z.string()),
  potential_challenges: z.array(z.string()),
  success_metrics: z.array(z.string()),
  user_flow_diagram: z.object({
    description: z.string(),
    initialNodes: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.object({
          title: z.string(),
          description: z.string(),
          checklist: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
              status: z.enum(["done", "in-progress", "pending"]),
            })
          ),
        }),
      })
    ),
    initialEdges: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        animated: z.boolean(),
        label: z.string().optional(),
      })
    ),
  }),
  kanban_tickets: z.object({
    description: z.string(),
    columns: z.record(z.object({
      title: z.string(),
      tickets: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: z.string(),
        story_points: z.number(),
        assignee: z.string().optional(),
        labels: z.array(z.string()).optional(),
      })),
    })),
  }),
});

// Function to call OpenAI API
async function callOpenAI(prompt: string) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
    }

    console.log(`Calling OpenAI API with model: ${OPENAI_MODEL}`);

    const { object } = await generateObject({
      model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system: 'You are an expert AI SaaS architect and technical consultant. You provide comprehensive, detailed blueprints for AI SaaS projects with practical, actionable recommendations. IMPORTANT: Return ONLY valid JSON that adheres to the provided schema.',
      prompt: prompt,
      schema: blueprintSchema,
    });
    console.log('OpenAI response received successfully');
    return object;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: userId },
      include: { blueprint: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { projectTitle, projectDescription } = body;

    if (!projectTitle || !projectDescription) {
      return NextResponse.json({
        success: false,
        error: 'Project title and description are required'
      }, { status: 400 });
    }

    // Create enhanced prompt for ChatGPT
    const prompt = `Generate a comprehensive, detailed json as given for this idea: Project Description:** ${projectDescription}

json :i will give idea to llm and in return i need thistype of json{
  "platform": {
    "name": "Remote Team Culture Builder",
    "tagline": "Connect, Recognize, Thrive: Your AI-Powered Remote Culture Hub",
    "description": "A SaaS tool to enhance remote team collaboration and morale through automated team-building activities, employee recognition systems, and mental health check-ins. Integrates seamlessly with Slack, Microsoft Teams, and HR platforms, fostering a vibrant and supportive remote work environment."
  },
  "market_feasibility_analysis": {
    "overall_score": 9.0,
    "metrics": [
      {
        "label": "Uniqueness",
        "score": 9,
        "description": "Strong differentiation with AI-powered personalized activity suggestions, moving beyond generic scheduling tools."
      },
      {
        "label": "Stickiness",
        "score": 9,
        "description": "High retention potential due to continuous value through ongoing activities, recognition, and mental health support, becoming an integral part of team operations."
      },
      {
        "label": "Growth Trend",
        "score": 9,
        "description": "Excellent alignment with the persistent growth of remote/hybrid work models and increasing corporate focus on employee well-being and engagement."
      },
      {
        "label": "Pricing Potential",
        "score": 8,
        "description": "Solid monetization through per-user pricing, scalable for various company sizes, and clear value for premium features."
      },
      {
        "label": "Upsell Potential",
        "score": 8,
        "description": "Good opportunities for premium features like advanced analytics, custom integrations, and dedicated support for larger enterprises."
      },
      {
        "label": "Customer Purchasing Power",
        "score": 9,
        "description": "Target market (remote-first companies, startups, enterprises) has a demonstrated budget for HR tech, employee engagement, and collaboration tools."
      }
    ]
  },
  "suggested_improvements": [
    "Develop a robust onboarding flow for new teams to quickly set preferences and integrate platforms.",
    "Introduce 'Culture Playbooks' or templates for different team sizes/types (e.g., small startup, large engineering team).",
    "Integrate with popular project management tools (e.g., Jira, Asana) for context-aware recognition suggestions.",
    "Add gamification elements for activity participation and recognition (e.g., team leaderboards, badges).",
    "Enable custom activity creation by admins with AI guidance on best practices.",
    "Offer anonymous feedback mechanisms for activity effectiveness and platform improvements.",
    "Implement an 'AI culture audit' feature that suggests areas for improvement based on platform data.",
    "Develop a mobile app for on-the-go check-ins and quick recognition."
  ],
  "core_features": [
    {
      "name": "AI-Powered Activity Suggestions",
      "description": "Intelligent recommendation engine for team-building activities based on preferences, schedules, and team dynamics."
    },
    {
      "name": "Automated Team-Building Activities",
      "description": "Library of virtual games, icebreakers, workshops, and social events with automated scheduling and reminders."
    },
    {
      "name": "Employee Recognition System",
      "description": "Platform for peer-to-peer and manager recognition, public shout-outs, and customizable awards."
    },
    {
      "name": "Mental Health Check-ins",
      "description": "Anonymous mood tracking, well-being surveys, and curated resources for mental health support."
    },
    {
      "name": "Communication Platform Integrations",
      "description": "Seamless integration with Slack and Microsoft Teams for activity notifications, check-ins, and recognition."
    },
    {
      "name": "HR Platform Integrations",
      "description": "Connects with HRIS for simplified user management and data synchronization (e.g., onboarding/offboarding)."
    },
    {
      "name": "User & Team Management",
      "description": "Admin controls for organizing users into teams, setting permissions, and customizing platform settings."
    },
    {
      "name": "Basic Analytics & Reporting",
      "description": "Dashboards showing activity participation rates, recognition trends, and aggregated well-being insights."
    }
  ],
  "technical_requirements": {
    "recommended_expertise_level": "Mid-Senior Level Developer",
    "development_timeline": "9-12 months for MVP (including AI core)",
    "team_size": "4-6 developers",
    "suggested_tech_stack": {
      "frontend": {
        "framework": "Next.js 15",
        "library": "React",
        "styling": "Tailwind CSS",
        "animations": "Framer Motion",
        "language": "TypeScript"
      },
      "backend": {
        "database": "PostgreSQL (with cloud provider like Neon/Supabase for scalability)",
        "orm": "Prisma",
        "ai_ml_framework": "Python (TensorFlow/PyTorch) for AI models with FastAPI/Node.js microservices for integration",
        "authentication": "NextAuth.js / Auth0",
        "integrations_sdk": "Node.js (for Slack/Teams APIs)",
        "task_queue": "Celery / RabbitMQ (for async AI tasks and notifications)"
      },
      "infrastructure": {
        "hosting": "Vercel (frontend) / AWS EC2/Lambda (backend/AI)",
        "cdn": "Cloudflare",
        "monitoring": "Datadog / Sentry",
        "analytics": "Mixpanel / Google Analytics 4",
        "logging": "ELK Stack / Grafana Loki"
      }
    }
  },
  "revenue_model": {
    "primary_streams": [
      "Per-user monthly subscription fees",
      "Premium add-ons for advanced features",
      "Enterprise licensing with custom pricing and support"
    ],
    "pricing_structure": "Tiered subscriptions based on user count and feature sets."
  },
  "recommended_pricing_plans": [
    {
      "name": "Starter",
      "price": "$5 per user/month",
      "target": "Small teams (up to 25 users) and startups",
      "features": [
        "Automated team-building activities (standard library)",
        "Basic employee recognition system",
        "Mood check-ins",
        "Slack/Teams integration",
        "Limited analytics dashboard"
      ],
      "limitations": [
        "No AI personalization for activities",
        "No HR platform integration",
        "Standard customer support"
      ]
    },
    {
      "name": "Pro",
      "price": "$10 per user/month",
      "tag": "Recommended",
      "target": "Growing remote-first companies (26-250 users)",
      "features": [
        "All Starter features",
        "AI-powered personalized activity suggestions",
        "Advanced recognition features (e.g., custom badges)",
        "HR platform integration",
        "Comprehensive analytics dashboards",
        "Priority customer support",
        "Customizable activity templates"
      ],
      "additional_benefits": [
        "Early access to new activity types",
        "API access for limited custom integrations"
      ]
    },
    {
      "name": "Enterprise",
      "price": "Custom Pricing",
      "target": "Large enterprises (250+ users) and organizations with complex needs",
      "features": [
        "All Pro features included",
        "Dedicated account manager",
        "White-label options",
        "Custom integrations and dedicated API support",
        "Enhanced security and compliance features",
        "Custom reporting and ROI tracking",
        "SLA guarantees"
      ],
      "premium_features": [
        "On-demand culture consulting",
        "Advanced AI model fine-tuning for specific company culture",
        "Single Sign-On (SSO)"
      ]
    }
  ],
  "competitive_advantages": [
    "AI-driven personalization for activities and recognition, leading to higher engagement and relevance.",
    "Holistic approach combining team-building, recognition, and mental health in one platform.",
    "Seamless integration with existing communication and HR tools, minimizing friction.",
    "Proactive approach to culture building rather than reactive problem-solving.",
    "Scalability to support diverse team sizes and organizational structures."
  ],
  "potential_challenges": [
    "Ensuring robust AI model performance and continuous improvement for personalization.",
    "Addressing data privacy and security concerns, especially with mental health data.",
    "Achieving high adoption rates across diverse employee demographics and tech savviness.",
    "Educating the market on the long-term ROI of proactive culture building.",
    "Competition from existing engagement platforms and point solutions.",
    "Managing the balance between automation and human interaction in culture building."
  ],
  "success_metrics": [
    "User engagement rate (daily/weekly active users, activity participation).",
    "Employee satisfaction scores (from check-ins and external surveys).",
    "Reduction in employee turnover rates (long-term indicator).",
    "Number of recognition events/messages per user.",
    "Customer churn rate and Net Promoter Score (NPS).",
    "Revenue growth and average revenue per user (ARPU).",
    "Successful integration completion rates for new clients."
  ],
  "user_flow_diagram": {
    "description": "Complete user journey mapping for team admins and individual employees on the Remote Team Culture Builder platform.",
    "initialNodes": [
      {
        "id": "1",
        "type": "customNode",
        "position": { "x": 0, "y": 0 },
        "data": {
          "title": "Platform Entry",
          "description": "Admin or Employee signs up/logs in",
          "checklist": [
            { "id": "cl-1-1", "label": "Admin Registration/Login", "status": "done" },
            { "id": "cl-1-2", "label": "Employee Onboarding (via invite)", "status": "done" },
            { "id": "cl-1-3", "label": "Profile Setup & Preferences (Employee)", "status": "in-progress" }
          ]
        }
      },
      {
        "id": "2",
        "type": "customNode",
        "position": { "x": 350, "y": -100 },
        "data": {
          "title": "Admin Dashboard",
          "description": "Central hub for culture management",
          "checklist": [
            { "id": "cl-2-1", "label": "Team Management", "status": "done" },
            { "id": "cl-2-2", "label": "Integration Setup (Slack, Teams, HRIS)", "status": "done" },
            { "id": "cl-2-3", "label": "Analytics & Reporting", "status": "in-progress" }
          ]
        }
      },
      {
        "id": "3",
        "type": "customNode",
        "position": { "x": 350, "y": 100 },
        "data": {
          "title": "Employee Dashboard",
          "description": "Personalized view for daily engagement",
          "checklist": [
            { "id": "cl-3-1", "label": "Upcoming Activities", "status": "done" },
            { "id": "cl-3-2", "label": "Recognition Feed", "status": "in-progress" },
            { "id": "cl-3-3", "label": "Mental Health Check-in", "status": "pending" }
          ]
        }
      },
      {
        "id": "4",
        "type": "customNode",
        "position": { "x": 700, "y": -200 },
        "data": {
          "title": "Activity Management (Admin)",
          "description": "Admin creates/schedules activities",
          "checklist": [
            { "id": "cl-4-1", "label": "Browse Activity Library", "status": "done" },
            { "id": "cl-4-2", "label": "Schedule Automated Activity", "status": "done" },
            { "id": "cl-4-3", "label": "Review AI Suggestions", "status": "in-progress" }
          ]
        }
      },
      {
        "id": "5",
        "type": "customNode",
        "position": { "x": 700, "y": 0 },
        "data": {
          "title": "Recognition Management (Admin/Employee)",
          "description": "Sending and viewing recognition",
          "checklist": [
            { "id": "cl-5-1", "label": "Send Peer-to-Peer Recognition", "status": "done" },
            { "id": "cl-5-2", "label": "Send Manager Recognition", "status": "in-progress" },
            { "id": "cl-5-3", "label": "View Recognition History", "status": "pending" }
          ]
        }
      },
      {
        "id": "6",
        "type": "customNode",
        "position": { "x": 700, "y": 200 },
        "data": {
          "title": "Well-being Check-ins (Employee)",
          "description": "Employee conducts and views check-ins",
          "checklist": [
            { "id": "cl-6-1", "label": "Daily Mood Check", "status": "done" },
            { "id": "cl-6-2", "label": "Access Resource Library", "status": "in-progress" },
            { "id": "cl-6-3", "label": "View Personal Well-being Trends", "status": "pending" }
          ]
        }
      },
      {
        "id": "7",
        "type": "customNode",
        "position": { "x": 1050, "y": -100 },
        "data": {
          "title": "AI Recommendation Engine",
          "description": "Generates personalized suggestions",
          "checklist": [
            { "id": "cl-7-1", "label": "Process Employee Preferences", "status": "done" },
            { "id": "cl-7-2", "label": "Analyze Schedule & Availability", "status": "in-progress" },
            { "id": "cl-7-3", "label": "Generate Activity/Recognition Suggestions", "status": "pending" }
          ]
        }
      },
      {
        "id": "8",
        "type": "customNode",
        "position": { "x": 1050, "y": 100 },
        "data": {
          "title": "Integration Hub",
          "description": "Handles communication with external platforms",
          "checklist": [
            { "id": "cl-8-1", "label": "Send Slack/Teams Notifications", "status": "done" },
            { "id": "cl-8-2", "label": "Sync with HRIS Data", "status": "in-progress" },
            { "id": "cl-8-3", "label": "Process API Calls", "status": "pending" }
          ]
        }
      },
      {
        "id": "9",
        "type": "customNode",
        "position": { "x": 1400, "y": 0 },
        "data": {
          "title": "Analytics & Reporting Module",
          "description": "Presents key insights to admins",
          "checklist": [
            { "id": "cl-9-1", "label": "Engagement Metrics Dashboard", "status": "done" },
            { "id": "cl-9-2", "label": "Recognition Trends Report", "status": "in-progress" },
            { "id": "cl-9-3", "label": "Anonymized Well-being Insights", "status": "pending" }
          ]
        }
      }
    ],
    "initialEdges": [
      { "id": "e1-2", "source": "1", "target": "2", "animated": true, "label": "Admin Path" },
      { "id": "e1-3", "source": "1", "target": "3", "animated": true, "label": "Employee Path" },
      { "id": "e2-4", "source": "2", "target": "4", "animated": true },
      { "id": "e2-5", "source": "2", "target": "5", "animated": true },
      { "id": "e2-8", "source": "2", "target": "8", "animated": true },
      { "id": "e3-5", "source": "3", "target": "5", "animated": true },
      { "id": "e3-6", "source": "3", "target": "6", "animated": true },
      { "id": "e3-8", "source": "3", "target": "8", "animated": true },
      { "id": "e4-7", "source": "4", "target": "7", "animated": true, "label": "Requests AI" },
      { "id": "e5-7", "source": "5", "target": "7", "animated": true, "label": "Feeds AI Data" },
      { "id": "e6-7", "source": "6", "target": "7", "animated": true, "label": "Feeds AI Data" },
      { "id": "e7-4", "source": "7", "target": "4", "animated": true, "label": "Sends Suggestions" },
      { "id": "e7-3", "source": "7", "target": "3", "animated": true, "label": "Sends Personalization" },
      { "id": "e4-8", "source": "4", "target": "8", "animated": true, "label": "Triggers Notification" },
      { "id": "e5-8", "source": "5", "target": "8", "animated": true, "label": "Triggers Notification" },
      { "id": "e6-8", "source": "6", "target": "8", "animated": true, "label": "Triggers Notification" },
      { "id": "e7-9", "source": "7", "target": "9", "animated": true, "label": "Feeds Data" },
      { "id": "e8-9", "source": "8", "target": "9", "animated": true, "label": "Feeds Data" }
    ]
  },
  "kanban_tickets": {
    "description": "Initial development tickets organized by priority and status for MVP launch.",
    "columns": {
      "backlog": {
        "title": "Backlog",
        "tickets": [
          {
            "id": "RTCB-001",
            "title": "AI: Basic Activity Recommendation Engine (Rule-based MVP)",
            "description": "Implement initial rule-based logic for suggesting activities based on explicit preferences.",
            "priority": "high",
            "story_points": 13
          },
          {
            "id": "RTCB-002",
            "title": "Activity Library Management (Admin)",
            "description": "Allow admins to add/edit activities in a central library with descriptions and tags.",
            "priority": "medium",
            "story_points": 8
          },
          {
            "id": "RTCB-003",
            "title": "Mental Health Check-in Feature",
            "description": "Develop anonymous daily/weekly mood check-in with simple reporting for admins.",
            "priority": "high",
            "story_points": 8
          },
          {
            "id": "RTCB-004",
            "title": "Employee Profile & Preference Setup",
            "description": "Build user profiles allowing employees to set activity preferences and basic info.",
            "priority": "high",
            "story_points": 5
          },
          {
            "id": "RTCB-005",
            "title": "HR Platform Integration (Initial API - e.g., BambooHR)",
            "description": "Set up API connection for user syncing from a popular HR platform.",
            "priority": "medium",
            "story_points": 13
          }
        ]
      },
      "todo": {
        "title": "To Do",
        "tickets": [
          {
            "id": "RTCB-006",
            "title": "User Authentication (Admin & Employee)",
            "description": "Implement NextAuth.js for secure login/registration for both admin and employee roles.",
            "priority": "critical",
            "story_points": 8,
            "assignee": "dev-frontend-001",
            "labels": ["frontend", "backend", "security"]
          },
          {
            "id": "RTCB-007",
            "title": "Database Schema Design (Core Entities)",
            "description": "Design and implement Prisma schema for Users, Teams, Activities, Recognition, Check-ins.",
            "priority": "critical",
            "story_points": 13,
            "assignee": "dev-backend-001",
            "labels": ["backend", "database", "schema"]
          },
          {
            "id": "RTCB-008",
            "title": "Landing Page & Marketing Site",
            "description": "Create a compelling public-facing website for the product with key features and pricing.",
            "priority": "medium",
            "story_points": 5,
            "assignee": "designer-001",
            "labels": ["marketing", "frontend", "design"]
          }
        ]
      },
      "in_progress": {
        "title": "In Progress",
        "tickets": [
          {
            "id": "RTCB-009",
            "title": "Next.js Project Setup & Core Dependencies",
            "description": "Initialize the Next.js project with Tailwind CSS and core libraries.",
            "priority": "critical",
            "story_points": 3,
            "assignee": "dev-frontend-001",
            "labels": ["setup", "frontend", "infrastructure"]
          },
          {
            "id": "RTCB-010",
            "title": "PostgreSQL Database Provisioning & Prisma Setup",
            "description": "Set up cloud PostgreSQL instance and configure Prisma ORM connection.",
            "priority": "critical",
            "story_points": 5,
            "assignee": "dev-backend-001",
            "labels": ["backend", "database", "infrastructure"]
          },
          {
            "id": "RTCB-011",
            "title": "Slack Integration (Initial Webhook/API Calls)",
            "description": "Implement basic functionality to send activity notifications and recognition alerts to Slack channels.",
            "priority": "high",
            "story_points": 8,
            "assignee": "dev-backend-002",
            "labels": ["integrations", "backend"]
          }
        ]
      },
      "review": {
        "title": "Code Review",
        "tickets": [
          {
            "id": "RTCB-012",
            "title": "Basic Admin Dashboard Layout",
            "description": "Frontend layout for the admin dashboard with navigation and placeholders for key sections.",
            "priority": "high",
            "story_points": 5,
            "assignee": "dev-frontend-002",
            "labels": ["frontend", "dashboard"]
          }
        ]
      },
      "done": {
        "title": "Done",
        "tickets": [
          {
            "id": "RTCB-013",
            "title": "Initial Market Research & Idea Validation",
            "description": "Completed competitive analysis and target market validation.",
            "priority": "critical",
            "story_points": 3,
            "assignee": "product-manager-001",
            "labels": ["planning", "research"]
          },
          {
            "id": "RTCB-014",
            "title": "Core Feature Outlining",
            "description": "Defined the essential features for the MVP.",
            "priority": "critical",
            "story_points": 2,
            "assignee": "product-manager-001",
            "labels": ["planning", "features"]
          }
        ]
      }
    }
  }
}`;

    // Call OpenAI API and get parsed JSON
    const aiResponseJSON = await callOpenAI(prompt);
    if (!aiResponseJSON) {
      throw new Error('No response received from AI model');
    }

    // --- FIX: Separate userflow and kanban data to prevent duplication ---
    const { user_flow_diagram, kanban_tickets, ...blueprintContent } = aiResponseJSON;

    await prisma.project.create({
      data: {
        name: projectTitle,
        description: projectDescription,
        userId: userId,
        blueprint: {
          create: {
            title: `${projectTitle} Blueprint`,
            content: blueprintContent, // Store only the remaining blueprint content
          },
        },
        userFlow: {
          create: {
            nodes: user_flow_diagram?.initialNodes || [],
            edges: user_flow_diagram?.initialEdges || [],
          },
        },
        kanban: {
          create: {
            columns: kanban_tickets?.columns || {},
          },
        },
        memoryBank: {
          create: {},
        },
      },
      include: {
        blueprint: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        project: aiResponseJSON
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate project blueprint'
    }, { status: 500 });
  }
}

