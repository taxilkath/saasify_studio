import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    const project = await Project.findById(id).populate('blueprint');
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
} 