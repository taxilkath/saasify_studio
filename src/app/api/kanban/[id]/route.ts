import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * Interface for the expected structure of the blueprint's content field.
 * This provides type safety and avoids using `any`.
 */
interface BlueprintContent {
  kanban_tickets?: {
    columns: any; // You can define a more specific type for columns if available
  };
}

/**
 * @description GET handler to fetch Kanban board data for a specific project.
 * If a Kanban board does not exist for the project, it attempts to create
 * one from the project's associated blueprint.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectId = params.id;

    // First, find the project and include any existing kanban board
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
      include: {
        kanban: true,
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }

    // If the kanban board already exists, return it
    if (project.kanban) {
      return NextResponse.json({ success: true, data: project.kanban }, { status: 200 });
    }

    // If no kanban exists, try to create it from the blueprint
    console.log(`[GET /api/kanban] No kanban found for project ${projectId}. Checking for blueprint.`);
    
    const blueprint = await prisma.blueprint.findUnique({
      where: { projectId },
    });

    const blueprintContent = blueprint?.content as BlueprintContent | null;

    // Check if the blueprint and the necessary kanban data exist within it
    if (blueprintContent?.kanban_tickets?.columns) {
      const newKanban = await prisma.kanban.create({
        data: {
          projectId: projectId,
          columns: blueprintContent.kanban_tickets.columns,
        },
      });
      console.log(`[GET /api/kanban] Created new kanban from blueprint for project ${projectId}.`);
      return NextResponse.json({ success: true, data: newKanban }, { status: 200 });
    }

    // If no blueprint is found or it lacks data, return a successful response with an empty state
    console.log(`[GET /api/kanban] No blueprint data available to create kanban for project ${projectId}.`);
    return NextResponse.json({ success: true, data: { projectId, columns: [] } }, { status: 200 });

  } catch (error: any) {
    console.error(`[GET /api/kanban/${params.id}]`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch kanban data' }, { status: 500 });
  }
}

/**
 * @description PUT handler to update (or create) the Kanban board data for a project.
 * It uses an 'upsert' operation to ensure atomicity.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectId = params.id;
    const body = await req.json();
    const { columns } = body;

    if (!columns) {
      return NextResponse.json({ success: false, error: 'Kanban columns data is required' }, { status: 400 });
    }
    
    // Ensure the user owns the project before allowing an update
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: userId },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }

    // Use 'upsert' to either update the existing Kanban board or create it if it doesn't exist
    const kanban = await prisma.kanban.upsert({
      where: { projectId: projectId },
      update: { columns },
      create: { projectId: projectId, columns },
    });

    return NextResponse.json({ success: true, data: kanban }, { status: 200 });
  } catch (error: any) {
    console.error(`[PUT /api/kanban/${params.id}]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update kanban data' }, { status: 500 });
  }
}