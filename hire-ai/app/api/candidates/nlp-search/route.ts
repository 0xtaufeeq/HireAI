import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import candidatesData from '@/data/sample-candidates.json'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface Candidate {
  linkedin_profile_url: string
  name: string
  headline: string
  location: string
  summary: string
  age: number
  profile_image_url: string
  field_category: string
  work_experience: any[]
  education_experience: any[]
  skills: string[]
  languages: any[]
  certifications: any[]
  connections_count: string
}

export async function POST(request: NextRequest) {
  let limit = 20
  
  try {
    const requestData: { query: string; limit?: number } = await request.json()
    const query = requestData.query
    limit = requestData.limit || 20

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        candidates: candidatesData.slice(0, limit),
        searchType: 'default'
      })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create a prompt for Gemini to analyze the search query and match candidates
    const limitText = limit.toString()
    const prompt = `You are an AI-powered recruitment assistant. Analyze the following search query and match it against candidate profiles.

Search Query: "${query}"

Candidate Database (JSON format):
${JSON.stringify(candidatesData.slice(0, 30), null, 2)}

Instructions:
1. Understand the intent behind the search query (skills, experience, location, role type, etc.)
2. Score each candidate from 0-100 based on relevance to the query
3. Consider semantic matching, not just keyword matching
4. Look at all aspects: headline, summary, skills, experience, education, location
5. Return ONLY a JSON array of candidate objects with added "nlpScore" field
6. Sort by relevance score (highest first)
7. Include top ${limitText} most relevant candidates

Response format:
[
  {
    "linkedin_profile_url": "...",
    "name": "...",
    "headline": "...",
    "location": "...",
    "summary": "...",
    "age": 0,
    "profile_image_url": "...",
    "field_category": "...",
    "work_experience": [...],
    "education_experience": [...],
    "skills": [...],
    "languages": [...],
    "certifications": [...],
    "connections_count": "...",
    "nlpScore": 85,
    "matchReason": "Strong match for [specific reasons why this candidate matches]"
  }
]

Important: Return ONLY the JSON array, no additional text or explanation.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const candidates = JSON.parse(jsonMatch[0])
      
      // Validate the response
      if (!Array.isArray(candidates)) {
        throw new Error('Response is not an array')
      }

      // Filter out any invalid candidates and ensure all have required fields
      const validCandidates = candidates
        .filter(candidate => candidate && candidate.name && candidate.linkedin_profile_url)
        .slice(0, limit)

      return NextResponse.json({
        candidates: validCandidates,
        searchType: 'nlp',
        query: query,
        totalResults: validCandidates.length
      })

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError)
      
      // Fallback to traditional keyword search
      const fallbackCandidates = candidatesData.filter(candidate => {
        const searchText = `${candidate.name} ${candidate.headline} ${candidate.summary} ${candidate.skills.join(' ')} ${candidate.location}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      }).slice(0, limit).map(candidate => ({
        ...candidate,
        nlpScore: 70,
        matchReason: 'Keyword match (fallback)'
      }))

      return NextResponse.json({
        candidates: fallbackCandidates,
        searchType: 'fallback',
        query: query,
        totalResults: fallbackCandidates.length
      })
    }

  } catch (error) {
    console.error('NLP Search Error:', error)
    
    // Return basic search as fallback
    const fallbackCandidates = candidatesData.slice(0, limit)
    
    return NextResponse.json({
      candidates: fallbackCandidates,
      searchType: 'error_fallback',
      error: 'NLP search temporarily unavailable',
      totalResults: fallbackCandidates.length
    })
  }
} 