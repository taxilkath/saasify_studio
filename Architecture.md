Architecture Overview for SaaSify Studio
This document outlines the architecture of the SaaSify Studio application, a full-stack AI-powered platform for generating SaaS blueprints and managing projects.

1. Technology Stack
The application is built on a modern, full-stack JavaScript/TypeScript foundation, leveraging Next.js for both frontend and backend capabilities.

Category	Technology	Purpose
Framework	Next.js 15 (with Turbopack)	Full-stack React framework with App Router for routing and API layers.
Language	TypeScript	Type safety and improved developer experience.
Frontend	React 19	Core UI library for building components.
Styling	Tailwind CSS 4, Shadcn/UI, Framer Motion	Utility-first styling, pre-built components, and UI animations.
State Mgt.	Zustand, TanStack Query	Client-side state (projects, kanban) and server state management.
Auth	Clerk	User authentication, management, and middleware for route protection.
Backend	Next.js API Routes	Server-side logic and API endpoints.
Database	MongoDB	NoSQL database for storing project and user data.
ORM	Mongoose	Object Data Modeling (ODM) for interacting with MongoDB.
AI	OpenAI API (gpt-4o-mini)	Core engine for generating the SaaS blueprint content.
UI Features	React Flow, @dnd-kit, Recharts	Building user flow diagrams, Kanban boards, and charts.

Export to Sheets
2. Project Structure
The project follows a standard Next.js App Router structure. Key directories include:

/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Authentication routes (sign-in, sign-up)
│   │   ├── api/                # Backend API endpoints
│   │   │   └── projects/
│   │   │       ├── route.ts    # GET all / POST new project
│   │   │       └── [id]/
│   │   │           └── route.ts# GET/DELETE project by ID
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── studio/             # Hub page for all projects
│   │   │   └── [id]/           # Detail page for a single project
│   │   ├── layout.tsx          # Root layout for the application
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components from Shadcn
│   │   ├── DeleteConfirmDialog.tsx # Dialog for confirming project deletion
│   │   ├── GenerateBlueprintDialog.tsx # Dialog for new project creation
│   │   ├── Navbar.tsx          # Main navigation sidebar
│   │   └── ...                 # Other shared components
│   │
│   ├── lib/
│   │   ├── mongodb.ts          # MongoDB connection logic
│   │   ├── projectStore.ts     # Zustand store for projects
│   │   ├── kanbanStore.ts      # Zustand store for Kanban board
│   │   └── utils.ts            # Utility functions (e.g., cn)
│   │
│   ├── models/
│   │   ├── Project.ts          # Mongoose schema for Projects
│   │   ├── Blueprint.ts        # Mongoose schema for Blueprints
│   │   └── User.ts             # Mongoose schema for Users
│   │
│   └── types/
│       └── blueprint.ts        # TypeScript type definitions
│
├── public/                     # Static assets (images, etc.)
├── package.json                # Project dependencies and scripts
└── next.config.ts              # Next.js configuration
3. Core Concepts & Data Flow
3.1. Authentication
Provider: Authentication is handled entirely by Clerk.
Middleware: The src/middleware.ts file uses authMiddleware from Clerk to protect routes. Public routes like / (landing page), /sign-in, and /sign-up are accessible to unauthenticated users. All other routes, including /dashboard and /studio, require a signed-in user.
UI: The (auth) route group contains the pages for sign-in and sign-up, which use Clerk's pre-built UI components. The UserProfile component is used on the /users page.
3.2. Data Models
The core data is stored in MongoDB and structured with two main Mongoose schemas:

Project (Project.ts): Represents a user-created project.
name: String - The title of the project.
description: String - A short description of the project idea.
blueprint: ObjectId - A reference (ref) to the Blueprint collection.
Blueprint (Blueprint.ts): Stores the detailed AI-generated content.
title: String - The title of the blueprint.
content: Mixed - A flexible field to store the entire JSON object returned by the AI.
3.3. AI Blueprint Generation Flow
This is the central feature of the application.

User Input: The user clicks "Generate SaaS Blueprint" on the /dashboard, which opens the GenerateBlueprintDialog. The user provides a Project Title and Description.
API Request: The form data is submitted to the POST /api/projects endpoint.
AI Prompting: The backend API route constructs a detailed prompt, instructing the OpenAI model (gpt-4o-mini) to act as a SaaS architect and return a comprehensive plan in a specific JSON format.
AI Response: The OpenAI API processes the prompt and returns a JSON object containing market analysis, feature suggestions, technical requirements, and more.
Database Storage:
The content from the AI is saved as a new document in the blueprints collection.
A new document is created in the projects collection, containing the user's title and description, along with a reference to the newly created blueprint's ID.
UI Update: The client receives the newly created project data. The projectStore (Zustand) is updated, and the UI re-renders to show the new project on the dashboard.
4. Frontend Architecture
The frontend is built with Next.js and React, focusing on a component-based, state-managed architecture.

4.1. Routing
The app uses the Next.js App Router for all routing.

/ (page.tsx): A public-facing marketing and landing page.
/dashboard: The main view after login, displaying a grid of all user projects.
/studio: A hub page that lists all projects, allowing a user to select one to work on.
/studio/[id]: The detailed workspace for a single project, featuring a tabbed interface to switch between BlueprintDisplay, OverviewSection, UserFlowDiagram, and KanbanBoardDnd.
/users: A page to manage the user's profile using Clerk's <UserProfile> component.
4.2. State Management
Zustand: Used for managing global client-side state.
useProjectStore: Caches the list of projects, manages the blueprint generation UI state (isGenerating, currentStep), and handles the "create project" dialog state.
useKanbanStore: Manages the state of the Kanban board, including columns and tickets, and the logic for moving tickets between columns.
TanStack Query (React Query): Used for fetching, caching, and managing server state. It simplifies data fetching, loading, and error states, particularly for project data.
4.3. Key UI Components
Navbar: A collapsible sidebar providing primary navigation. It is responsive and adjusts for mobile views.
Dashboard (dashboard/page.tsx): Fetches and displays all projects in a grid layout. Each project card includes quick links to its analytics, user flow, and tasks. It also contains the entry point for creating new projects.
Studio (studio/[id]/page.tsx): The core workspace. It uses a tabbed layout to render different views of the project data.
BlueprintDisplay: Renders the formatted, read-only AI-generated blueprint.
UserFlowDiagram: Uses React Flow to render an interactive, animated diagram based on the user_flow_diagram data in the blueprint.
KanbanBoardDnd: Uses @dnd-kit to create a fully interactive drag-and-drop Kanban board, populated from the kanban_tickets data in the blueprint.
