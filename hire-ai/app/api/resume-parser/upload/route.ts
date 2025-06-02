import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface ParsedResumeData {
  name: string
  email: string
  phone: string
  linkedin_url?: string
  github_url?: string
  summary: string
  skills: string[]
  experience: Array<{
    job_title: string
    company: string
    start_date: string
    end_date: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field_of_study: string
    graduation_date: string
  }>
}

interface ProcessingResult {
  id: string
  fileName: string
  status: 'processing' | 'completed' | 'failed'
  uploadTime: string
  extractedData?: ParsedResumeData
  error?: string
  progress?: number
}

// Convert file to base64 for Gemini API
function fileToGenerativePart(filePath: string, mimeType: string) {
  const fileData = fs.readFileSync(filePath)
  return {
    inlineData: {
      data: fileData.toString('base64'),
      mimeType
    }
  }
}

// Get MIME type based on file extension
function getMimeType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase()
  const mimeTypes: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp'
  }
  return mimeTypes[extension] || 'application/octet-stream'
}

// Extract text using Gemini OCR for all file types
async function extractTextWithGeminiOCR(filePath: string, originalName: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const mimeType = getMimeType(originalName)
    
    console.log(`Processing ${originalName} with MIME type: ${mimeType}`)
    
    const filePart = fileToGenerativePart(filePath, mimeType)
    
    const prompt = `
Please extract ALL the text content from this document/image. 
This appears to be a resume or CV document.
Please return the complete text content exactly as it appears, maintaining the structure and formatting as much as possible.
Do not summarize or interpret - just extract the raw text content.
`

    const result = await model.generateContent([prompt, filePart])
    const response = await result.response
    const text = response.text()
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the file using OCR')
    }
    
    console.log(`Successfully extracted ${text.length} characters from ${originalName}`)
    return text.trim()
    
  } catch (error) {
    console.error(`OCR extraction error for ${originalName}:`, error)
    throw new Error(`Failed to extract text using OCR: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Extract text from DOCX files using dynamic import (fallback for non-image DOCX)
async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const data = await mammoth.extractRawText({ path: filePath })
    return data.value
  } catch (error) {
    console.error('DOCX parsing error, falling back to OCR:', error)
    throw error
  }
}

// Main text extraction function that uses OCR for all PDFs and images
async function extractTextFromFile(filePath: string, originalName: string): Promise<string> {
  const extension = path.extname(originalName).toLowerCase()
  
  // Use OCR for all PDFs and images
  if (['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(extension)) {
    return await extractTextWithGeminiOCR(filePath, originalName)
  }
  
  // For DOCX files, try mammoth first, then fallback to OCR
  if (extension === '.docx') {
    try {
      return await extractTextFromDOCX(filePath)
    } catch (error) {
      console.log('DOCX extraction failed, trying OCR...')
      return await extractTextWithGeminiOCR(filePath, originalName)
    }
  }
  
  // For DOC files, use OCR directly since mammoth may not work well
  if (extension === '.doc') {
    return await extractTextWithGeminiOCR(filePath, originalName)
  }
  
  throw new Error(`Unsupported file format: ${extension}`)
}

// Parse resume text using Gemini API
async function parseResumeWithGemini(resumeText: string): Promise<ParsedResumeData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
Given the following resume text, please extract the specified information and return it as a JSON object.
The JSON object should conform to the following schema:

{
  "name": "Full name of the person",
  "email": "Email address",
  "phone": "Phone number",
  "linkedin_url": "LinkedIn profile URL (optional)",
  "github_url": "GitHub profile URL (optional)",
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "job_title": "Position title",
      "company": "Company name",
      "start_date": "Start date (e.g., 'January 2020' or '2020')",
      "end_date": "End date (e.g., 'December 2022' or 'Present')",
      "description": "Job description or key responsibilities"
    }
  ],
  "education": [
    {
      "institution": "University or school name",
      "degree": "Degree type (e.g., 'Bachelor of Science', 'Master of Arts')",
      "field_of_study": "Major or field of study",
      "graduation_date": "Graduation date (e.g., '2018' or 'May 2018')"
    }
  ]
}

Important guidelines:
- Extract information as accurately as possible from the resume text
- If a field is not available, use appropriate default values (empty string for strings, empty array for arrays)
- For skills, extract both technical skills and soft skills mentioned
- For experience, include all relevant work experiences
- For education, include all degrees and certifications
- Return ONLY the JSON object, no additional text or explanations

Resume Text:
---
${resumeText}
---

JSON Output:
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response text to extract JSON
    let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Extract only the JSON part (between { and })
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
    }
    
    const parsedData = JSON.parse(jsonText)
    
    // Validate and ensure all required fields exist
    return {
      name: parsedData.name || '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      linkedin_url: parsedData.linkedin_url || '',
      github_url: parsedData.github_url || '',
      summary: parsedData.summary || '',
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : []
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error)
    throw new Error('Failed to parse AI response into structured data')
  }
}

// Process a single resume file
async function processResumeFile(filePath: string, originalName: string): Promise<ParsedResumeData> {
  try {
    console.log(`Starting to process file: ${originalName}`)
    
    // Extract text from the file using OCR
    const extractedText = await extractTextFromFile(filePath, originalName)
    
    if (!extractedText.trim()) {
      throw new Error('No text could be extracted from the file')
    }

    console.log(`Successfully extracted text, length: ${extractedText.length} characters`)

    // Parse the text with Gemini API
    const parsedData = await parseResumeWithGemini(extractedText)
    
    console.log(`Successfully parsed resume data for: ${parsedData.name || 'Unknown'}`)
    
    return parsedData
  } catch (error) {
    console.error(`Error processing ${originalName}:`, error)
    throw error
  } finally {
    // Clean up the uploaded file
    try {
      fs.unlinkSync(filePath)
    } catch (unlinkError) {
      console.error('Error deleting temporary file:', unlinkError)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Parse the multipart form data
    const data = await request.formData()
    const files = data.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const results: ProcessingResult[] = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const result: ProcessingResult = {
        id: fileId,
        fileName: file.name,
        status: 'processing',
        uploadTime: 'just now',
        progress: 0
      }

      try {
        console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`)
        
        // Save file temporarily
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const tempFilePath = path.join(uploadsDir, `${fileId}-${file.name}`)
        fs.writeFileSync(tempFilePath, buffer)

        result.progress = 25

        // Process the resume
        const extractedData = await processResumeFile(tempFilePath, file.name)
        
        result.status = 'completed'
        result.extractedData = extractedData
        result.progress = 100

      } catch (error) {
        result.status = 'failed'
        result.error = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error(`Failed to process ${file.name}:`, result.error)
      }

      results.push(result)
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: `Processed ${results.length} resume(s)` 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Enable file uploads
export const dynamic = 'force-dynamic'
