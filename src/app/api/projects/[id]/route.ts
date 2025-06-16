// src/app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // <-- Import Prisma client

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ // <-- Prisma query
      where: { id: params.id },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({ where: { id: params.id } }); // <-- Prisma query

    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}