import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ResumeStructuredData } from '@/types/resume';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF or DOC files.' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Extract text using Gemini API
    let extractedText = '';
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Convert file to base64 for Gemini API
      const base64Data = buffer.toString('base64');
      const mimeType = file.type;

      const prompt = `
        Extract all text content from this resume/CV document. 
        Preserve the structure and formatting as much as possible.
        Include all sections like personal information, experience, education, skills, etc.
        Return only the extracted text content.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      extractedText = response.text();
      
    } catch (error) {
      console.error('Error extracting text with Gemini:', error);
      extractedText = 'Error: Could not extract text from the document. Please try again or upload a different file.';
    }

    // Analyze extracted text to get structured data
    let structuredData: ResumeStructuredData | null = null;
    if (extractedText && !extractedText.startsWith('Error:')) {
      try {
        const analyzeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const analyzePrompt = `
          Analyze the following resume text and extract structured information. Return ONLY a valid JSON object with the following structure:

          {
            "name": "Full name of the person",
            "email": "Email address",
            "phone": "Phone number",
            "location": "City, State/Country",
            "title": "Current or most recent job title",
            "experience": "Years of experience (e.g., '5 years', 'Entry level')",
            "summary": "Brief professional summary or objective",
            "skills": ["skill1", "skill2", "skill3", ...],
            "education": [
              {
                "degree": "Degree name",
                "school": "School/University name",
                "year": "Graduation year",
                "gpa": "GPA if mentioned",
                "honors": "Any honors/distinctions"
              }
            ],
            "workHistory": [
              {
                "company": "Company name",
                "position": "Job title",
                "duration": "Start - End dates",
                "description": "Brief job description",
                "achievements": ["achievement1", "achievement2", ...]
              }
            ]
          }

          Rules:
          - If information is not found, use empty string "" for strings and empty array [] for arrays
          - Extract all relevant skills including technical skills, programming languages, tools, etc.
          - For experience, estimate years based on work history if not explicitly stated
          - Keep descriptions concise but informative
          - Return ONLY the JSON object, no additional text or formatting

          Resume text to analyze:
          ${extractedText}
        `;

        const analyzeResult = await analyzeModel.generateContent(analyzePrompt);
        const analyzeResponse = await analyzeResult.response;
        let aiResponseText = analyzeResponse.text();
        
        // Clean up the response - remove any markdown formatting or extra text
        aiResponseText = aiResponseText.trim();
        if (aiResponseText.startsWith('```json')) {
          aiResponseText = aiResponseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (aiResponseText.startsWith('```')) {
          aiResponseText = aiResponseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        structuredData = JSON.parse(aiResponseText) as ResumeStructuredData;
        
        // Validate the structure
        const requiredFields = ['name', 'email', 'phone', 'location', 'title', 'experience', 'skills', 'education', 'workHistory'];
        const isValid = requiredFields.every(field => field in structuredData);
        
        if (!isValid) {
          throw new Error('Invalid structure returned from AI');
        }

      } catch (error) {
        console.error('Error analyzing text:', error);
        // Continue without structured data
        structuredData = null;
      }
    }

    return NextResponse.json({
      success: true,
      filename: filename,
      originalName: file.name,
      size: file.size,
      extractedText: extractedText,
      structuredData: structuredData ?? undefined,
      uploadTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 