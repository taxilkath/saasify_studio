// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

// GET a single project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX: params is a Promise
) {
  try {
    const { id } = await params; // ✅ FIX: Await the params
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: id },
      include: { blueprint: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    console.error(`[GET /api/projects/[id]]`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a project by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX: params is a Promise
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { id } = await params; // ✅ FIX: Await the params
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    // First verify the project belongs to the user
    const project = await prisma.project.findFirst({
        where: { id: id, userId: userId }
    });

    if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found or you do not have permission' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: id } });

    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
  } catch (error: any) {
    console.error(`[DELETE /api/projects/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}

// UPDATE a project by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX: params is a Promise
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params; // ✅ FIX: Await the params
    const body = await req.json();
    const { name, description } = body;

    const project = await prisma.project.update({
      where: {
        id: id,
        userId: userId, // Ensure user can only update their own projects
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/projects/[id]]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}