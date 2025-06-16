// src/app/api/userflow/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * @description GET handler to fetch user flow data for a project.
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

    const { id: projectId } = await params; // ✅ FIX: Await the params

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: userId },
      include: { userFlow: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: project.userFlow }, { status: 200 });
  } catch (error: any) {
    console.error(`[GET /api/userflow/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user flow' }, { status: 500 });
  }
}

/**
 * @description PUT handler to update user flow data for a project.
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

    const { id: projectId } = await params; // ✅ FIX: Await the params
    const body = await req.json();
    const { nodes, edges } = body;

    if (!nodes || !edges) {
      return NextResponse.json({ success: false, error: 'Nodes and edges are required' }, { status: 400 });
    }
    
    // Ensure the project belongs to the authenticated user before updating
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: userId }
    });

    if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }
    
    const userFlow = await prisma.userFlow.upsert({
      where: { projectId: projectId },
      update: { nodes, edges },
      create: { projectId: projectId, nodes, edges },
    });

    return NextResponse.json({ success: true, data: userFlow }, { status: 200 });
  } catch (error: any) {
    console.error(`[PUT /api/userflow/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update user flow' }, { status: 500 });
  }
}