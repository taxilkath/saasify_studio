// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // <-- Import Prisma client
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ // <-- Prisma query
      where: { id: id },
      include: { blueprint: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { userId } = getAuth(req);
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({ where: { id: id } }); // <-- Prisma query

    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(req);
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    const project = await prisma.project.update({
      where: {
        id: params.id,
        userId: userId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/projects/${params.id}]`, error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}