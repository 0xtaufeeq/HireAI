import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

interface CandidateScore {
  candidateId: string
  name: string
  email: string
  score: number
  rank: number
  matchBreakdown: {
    skillsMatch: number
    experienceMatch: number
    educationMatch: number
    overallFit: number
  }
  strengths: string[]
  weaknesses: string[]
  recommendation: string
}

interface JobMatchResult {
  jobTitle: string
  totalCandidates: number
  averageScore: number
  topCandidates: CandidateScore[]
  leaderboard: CandidateScore[]
  matchInsights: {
    bestSkillMatches: string[]
    commonGaps: string[]
    recommendedActions: string[]
  }
}

// Analyze a single candidate against job description
async function analyzeCandidateJobMatch(
  candidate: ParsedResumeData,
  candidateId: string,
  jobDescription: string
): Promise<Omit<CandidateScore, 'rank'>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const candidateSkills = candidate.skills.join(', ')
  const candidateExperience = candidate.experience.map(exp => 
    `${exp.job_title} at ${exp.company} (${exp.start_date} - ${exp.end_date}): ${exp.description}`
  ).join('\n')
  const candidateEducation = candidate.education.map(edu => 
    `${edu.degree} in ${edu.field_of_study} from ${edu.institution} (${edu.graduation_date})`
  ).join('\n')

  const analysisPrompt = `
You are an expert recruiter analyzing candidate fit for a job position. 

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
Name: ${candidate.name}
Email: ${candidate.email}
Summary: ${candidate.summary}

Skills: ${candidateSkills}

Experience:
${candidateExperience}

Education:
${candidateEducation}

ANALYSIS REQUIRED:
Provide a comprehensive analysis in JSON format with the following structure:

{
  "score": 85,
  "matchBreakdown": {
    "skillsMatch": 90,
    "experienceMatch": 80,
    "educationMatch": 85,
    "overallFit": 85
  },
  "strengths": [
    "Strong technical skills matching job requirements",
    "Relevant industry experience",
    "Educational background aligns well"
  ],
  "weaknesses": [
    "Missing experience with specific technology X",
    "Could benefit from more senior-level experience"
  ],
  "recommendation": "Strong candidate - recommended for interview. Has excellent technical foundation and relevant experience, though may need some training in specific areas."
}

SCORING CRITERIA:
- Overall Score (0-100): Comprehensive fit for the role
- Skills Match (0-100): How well candidate's skills align with job requirements
- Experience Match (0-100): Relevance and depth of work experience
- Education Match (0-100): Educational background relevance
- Overall Fit (0-100): Cultural and role fit assessment

- Strengths: List 3-5 key strengths that make this candidate attractive
- Weaknesses: List 2-4 areas where candidate might be lacking
- Recommendation: Provide hiring recommendation and next steps

Be thorough but concise. Focus on job-relevant factors.
`

  try {
    const result = await model.generateContent(analysisPrompt)
    const response = await result.response
    const analysisText = response.text()

    // Clean and extract JSON
    let jsonText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
    }

    const analysis = JSON.parse(jsonText)

    return {
      candidateId,
      name: candidate.name,
      email: candidate.email,
      score: Math.min(100, Math.max(0, analysis.score || 0)),
      matchBreakdown: {
        skillsMatch: Math.min(100, Math.max(0, analysis.matchBreakdown?.skillsMatch || 0)),
        experienceMatch: Math.min(100, Math.max(0, analysis.matchBreakdown?.experienceMatch || 0)),
        educationMatch: Math.min(100, Math.max(0, analysis.matchBreakdown?.educationMatch || 0)),
        overallFit: Math.min(100, Math.max(0, analysis.matchBreakdown?.overallFit || 0))
      },
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      recommendation: analysis.recommendation || 'Analysis incomplete'
    }
  } catch (error) {
    console.error(`Error analyzing candidate ${candidate.name}:`, error)
    
    // Return default analysis if AI fails
    return {
      candidateId,
      name: candidate.name,
      email: candidate.email,
      score: 50,
      matchBreakdown: {
        skillsMatch: 50,
        experienceMatch: 50,
        educationMatch: 50,
        overallFit: 50
      },
      strengths: ['Unable to analyze'],
      weaknesses: ['Analysis failed'],
      recommendation: 'Manual review recommended - automated analysis failed'
    }
  }
}

// Generate overall job matching insights
async function generateJobMatchInsights(
  candidates: CandidateScore[],
  jobDescription: string
): Promise<{ bestSkillMatches: string[]; commonGaps: string[]; recommendedActions: string[] }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const candidateSummary = candidates.map(c => 
    `${c.name}: Score ${c.score}, Strengths: ${c.strengths.join(', ')}, Weaknesses: ${c.weaknesses.join(', ')}`
  ).join('\n')

  const insightsPrompt = `
Based on the job analysis results for ${candidates.length} candidates:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE ANALYSIS SUMMARY:
${candidateSummary}

Provide strategic insights in JSON format:

{
  "bestSkillMatches": [
    "List of 3-5 skills that candidates excel in for this role"
  ],
  "commonGaps": [
    "List of 3-5 skills/areas where most candidates are lacking"
  ],
  "recommendedActions": [
    "List of 3-5 actionable recommendations for hiring/recruiting strategy"
  ]
}

Focus on actionable insights for improving the candidate pool and hiring strategy.
`

  try {
    const result = await model.generateContent(insightsPrompt)
    const response = await result.response
    const insightsText = response.text()

    let jsonText = insightsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
    }

    const insights = JSON.parse(jsonText)

    return {
      bestSkillMatches: Array.isArray(insights.bestSkillMatches) ? insights.bestSkillMatches : [],
      commonGaps: Array.isArray(insights.commonGaps) ? insights.commonGaps : [],
      recommendedActions: Array.isArray(insights.recommendedActions) ? insights.recommendedActions : []
    }
  } catch (error) {
    console.error('Error generating job match insights:', error)
    return {
      bestSkillMatches: [],
      commonGaps: [],
      recommendedActions: ['Manual review recommended']
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { candidates, jobDescription, jobTitle } = await request.json()

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'No candidates provided' }, { status: 400 })
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
    }

    console.log(`Analyzing ${candidates.length} candidates against job: ${jobTitle || 'Untitled Position'}`)

    // Analyze each candidate
    const candidatePromises = candidates.map((candidateData: any) => 
      analyzeCandidateJobMatch(
        candidateData.extractedData,
        candidateData.id,
        jobDescription
      )
    )

    const candidateAnalyses = await Promise.all(candidatePromises)

    // Sort by score and assign ranks
    const rankedCandidates = candidateAnalyses
      .sort((a, b) => b.score - a.score)
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1
      }))

    // Calculate statistics
    const averageScore = Math.round(
      rankedCandidates.reduce((sum, c) => sum + c.score, 0) / rankedCandidates.length
    )

    // Get top 5 candidates
    const topCandidates = rankedCandidates.slice(0, 5)

    // Generate insights
    const matchInsights = await generateJobMatchInsights(rankedCandidates, jobDescription)

    const result: JobMatchResult = {
      jobTitle: jobTitle || 'Position Analysis',
      totalCandidates: candidates.length,
      averageScore,
      topCandidates,
      leaderboard: rankedCandidates,
      matchInsights
    }

    return NextResponse.json({ 
      success: true, 
      result 
    })

  } catch (error) {
    console.error('Job matching error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze job matches', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Enable dynamic content
export const dynamic = 'force-dynamic' 