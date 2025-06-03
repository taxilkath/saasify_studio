import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Blueprint from '@/models/Blueprint';

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'deepseek-r1:latest';

// Function to call Ollama API
async function callOllamaAPI(prompt: string) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.8,
          top_k: 40,
          num_predict: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama API call failed:', error);
    throw error;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find()
      .populate('blueprint')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods
    
    return NextResponse.json({ 
      success: true, 
      data: projects,
      count: projects.length 
    }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to fetch projects' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const { projectTitle, projectDescription } = body;

    if (!projectTitle || !projectDescription) {
      return NextResponse.json({ 
        success: false,
        error: 'Project title and description are required' 
      }, { status: 400 });
    }

    console.log('Received project title:', projectTitle);
    console.log('Received project description:', projectDescription);

    // Create enhanced prompt for DeepSeek
    const prompt = `You are an expert AI SaaS architect. Generate a comprehensive, detailed blueprint for an AI SaaS project.

Project Title: ${projectTitle}
Project Description: ${projectDescription}

Please provide a structured blueprint that includes:

1. **Executive Summary**
   - Project overview and value proposition
   - Target market and use cases

2. **Technical Architecture**
   - System architecture diagram description
   - Technology stack recommendations
   - Database design considerations
   - API structure and endpoints

3. **AI/ML Components**
   - Machine learning models required
   - Data requirements and sources
   - Training and inference pipeline
   - Model deployment strategy

4. **Features & Functionality**
   - Core features list
   - User interface requirements
   - Authentication and authorization
   - Integration capabilities

5. **Development Roadmap**
   - Phase 1: MVP development (2-3 months)
   - Phase 2: Feature expansion (3-4 months)
   - Phase 3: Scale and optimize (ongoing)

6. **Business Considerations**
   - Pricing model suggestions
   - Scalability requirements
   - Security and compliance needs
   - Potential challenges and solutions

Format your response in clear markdown with proper headings and bullet points.`;

    // Call Ollama API with DeepSeek
    const aiResponse = await callOllamaAPI(prompt);

    if (!aiResponse) {
      throw new Error('No response received from AI model');
    }

    // Connect to database
    await dbConnect();

    // Create new blueprint
    const blueprint = new Blueprint({
      title: `${projectTitle} Blueprint`,
      content: aiResponse,
      generatedAt: new Date(),
    });

    const savedBlueprint = await blueprint.save();

    // Create new project
    const project = new Project({
      title: projectTitle,
      description: projectDescription,
      blueprint: savedBlueprint._id,
      status: 'planning',
      createdAt: new Date(),
    });

    const savedProject = await project.save();

    // Populate the blueprint in the response
    await savedProject.populate('blueprint');

    return NextResponse.json({ 
      success: true,
      data: {
        project: savedProject,
        blueprint: aiResponse
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/projects error:', error);
    
    // Handle specific Ollama errors
    if (error.message.includes('Ollama API error')) {
      return NextResponse.json({ 
        success: false,
        error: 'AI service unavailable. Please ensure Ollama is running and DeepSeek model is available.' 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to generate project blueprint' 
    }, { status: 500 });
  }
}