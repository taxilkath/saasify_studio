import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project'; // Assuming this is your Mongoose model

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }
    const project = await Project.findById(id).populate('blueprint'); // Assuming 'blueprint' is a ref in your Project schema
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    console.error('GET Project Error:', error); // It's good to log the error on the server
    return NextResponse.json({ success: false, error: error.message || 'Server error retrieving project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) { // Explicitly type error and provide specific message
    console.error('DELETE Project Error:', error); // Server-side logging
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}