import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

// GET handler to fetch user flow data
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id, userId: userId },
      include: { userFlow: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: project.userFlow }, { status: 200 });
  } catch (error: any) {
    console.error(`[GET /api/userflow/${params.id}]`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user flow' }, { status: 500 });
  }
}

// PUT handler to update user flow data
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { nodes, edges } = body;

    if (!nodes || !edges) {
      return NextResponse.json({ success: false, error: 'Nodes and edges are required' }, { status: 400 });
    }
    
    // Ensure the project belongs to the authenticated user before updating
    const project = await prisma.project.findFirst({
        where: { id: params.id, userId: userId }
    });

    if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }
    
    const userFlow = await prisma.userFlow.upsert({
      where: { projectId: params.id },
      update: { nodes, edges },
      create: { projectId: params.id, nodes, edges },
    });

    return NextResponse.json({ success: true, data: userFlow }, { status: 200 });
  } catch (error: any) {
    console.error(`[PUT /api/userflow/${params.id}]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update user flow' }, { status: 500 });
  }
} 