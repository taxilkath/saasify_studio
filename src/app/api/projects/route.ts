import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Blueprint from '@/models/Blueprint';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().populate('blueprint');
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { project, blueprint } = body;

    if (!project || !blueprint) {
      return NextResponse.json({ error: 'Missing project or blueprint data' }, { status: 400 });
    }

    // Save blueprint first
    const newBlueprint = await Blueprint.create(blueprint);

    // Save project with reference to blueprint
    const newProject = await Project.create({
      ...project,
      blueprint: newBlueprint._id,
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
} 