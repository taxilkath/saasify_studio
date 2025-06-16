// src/app/api/kanban/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

// Interface for the expected structure of the blueprint's content field.
interface BlueprintContent {
  kanban_tickets?: {
    columns: any;
  };
}

/**
 * @description GET handler to fetch Kanban board data.
 * NOTE: In Next.js 15+, the `params` object is a Promise that must be awaited.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX: params is a Promise
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: projectId } = await params; // ✅ FIX: Await the params to resolve them

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
      include: { kanban: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }

    if (project.kanban) {
      return NextResponse.json({ success: true, data: project.kanban }, { status: 200 });
    }
    
    // Logic to create from blueprint if it doesn't exist...
    const blueprint = await prisma.blueprint.findUnique({
      where: { projectId },
    });

    const blueprintContent = blueprint?.content as BlueprintContent | null;

    if (blueprintContent?.kanban_tickets?.columns) {
      const newKanban = await prisma.kanban.create({
        data: {
          projectId: projectId,
          columns: blueprintContent.kanban_tickets.columns,
        },
      });
      return NextResponse.json({ success: true, data: newKanban }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: { projectId, columns: [] } }, { status: 200 });

  } catch (error: any) {
    // We can't safely access `params.id` here if the promise rejected
    console.error(`[GET /api/kanban/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch kanban data' }, { status: 500 });
  }
}

/**
 * @description PUT handler to update the Kanban board data.
 * NOTE: In Next.js 15+, the `params` object is a Promise that must be awaited.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX: params is a Promise
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: projectId } = await params; // ✅ FIX: Await the params to resolve them
    const body = await req.json();
    const { columns } = body;

    if (!columns) {
      return NextResponse.json({ success: false, error: 'Kanban columns data is required' }, { status: 400 });
    }
    
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: userId },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }

    const kanban = await prisma.kanban.upsert({
      where: { projectId: projectId },
      update: { columns },
      create: { projectId: projectId, columns },
    });

    return NextResponse.json({ success: true, data: kanban }, { status: 200 });
  } catch (error: any) {
    console.error(`[PUT /api/kanban/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update kanban data' }, { status: 500 });
  }
}