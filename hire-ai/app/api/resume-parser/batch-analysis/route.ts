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

interface BatchAnalysisResult {
  summary: {
    totalCandidates: number
    averageSkillsPerCandidate: number
    averageExperienceYears: number
    uniqueCompanies: number
    uniqueSkills: number
  }
  skillsAnalysis: {
    topSkills: Array<{ skill: string; count: number; percentage: number }>
    emergingSkills: string[]
    skillGaps: string[]
  }
  experienceAnalysis: {
    seniorityDistribution: { [key: string]: number }
    topCompanies: Array<{ company: string; count: number }>
    commonJobTitles: Array<{ title: string; count: number }>
  }
  educationAnalysis: {
    topUniversities: Array<{ university: string; count: number }>
    degreeDistribution: { [key: string]: number }
    fieldDistribution: { [key: string]: number }
  }
  marketInsights: {
    recommendedSalaryRange: string
    competitiveSkills: string[]
    improvementAreas: string[]
  }
}

// Analyze multiple resumes for batch insights
async function analyzeBatchResumes(resumesData: ParsedResumeData[]): Promise<BatchAnalysisResult> {
  // Basic analytics
  const totalCandidates = resumesData.length
  const totalSkills = resumesData.reduce((sum, r) => sum + r.skills.length, 0)
  const averageSkillsPerCandidate = Math.round(totalSkills / totalCandidates)

  // Skills analysis
  const skillCounts: { [key: string]: number } = {}
  const allSkills = new Set<string>()
  
  resumesData.forEach(resume => {
    resume.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
      allSkills.add(skill)
    })
  })

  const topSkills = Object.entries(skillCounts)
    .map(([skill, count]) => ({
      skill,
      count,
      percentage: Math.round((count / totalCandidates) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Experience analysis
  const allCompanies = new Set<string>()
  const allJobTitles = new Set<string>()
  const companyCounts: { [key: string]: number } = {}
  const titleCounts: { [key: string]: number } = {}
  const seniorityLevels: { [key: string]: number } = { 'Entry': 0, 'Mid': 0, 'Senior': 0 }

  resumesData.forEach(resume => {
    // Determine seniority based on experience count
    const expCount = resume.experience.length
    if (expCount <= 2) seniorityLevels['Entry']++
    else if (expCount <= 4) seniorityLevels['Mid']++
    else seniorityLevels['Senior']++

    resume.experience.forEach(exp => {
      allCompanies.add(exp.company)
      allJobTitles.add(exp.job_title)
      companyCounts[exp.company] = (companyCounts[exp.company] || 0) + 1
      titleCounts[exp.job_title] = (titleCounts[exp.job_title] || 0) + 1
    })
  })

  const topCompanies = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const commonJobTitles = Object.entries(titleCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Education analysis
  const universityCounts: { [key: string]: number } = {}
  const degreeCounts: { [key: string]: number } = {}
  const fieldCounts: { [key: string]: number } = {}

  resumesData.forEach(resume => {
    resume.education.forEach(edu => {
      universityCounts[edu.institution] = (universityCounts[edu.institution] || 0) + 1
      degreeCounts[edu.degree] = (degreeCounts[edu.degree] || 0) + 1
      fieldCounts[edu.field_of_study] = (fieldCounts[edu.field_of_study] || 0) + 1
    })
  })

  const topUniversities = Object.entries(universityCounts)
    .map(([university, count]) => ({ university, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Generate AI insights
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const skillsList = topSkills.map(s => s.skill).join(', ')
  const companiesList = topCompanies.map(c => c.company).join(', ')
  
  const insightsPrompt = `
Based on this candidate pool analysis:
- ${totalCandidates} candidates analyzed
- Top skills: ${skillsList}
- Companies represented: ${companiesList}
- Seniority: ${seniorityLevels.Entry} entry, ${seniorityLevels.Mid} mid, ${seniorityLevels.Senior} senior level

Provide market insights in JSON format:
{
  "recommendedSalaryRange": "Brief salary range estimate for this talent pool",
  "competitiveSkills": ["List of 3-5 most valuable/competitive skills from this pool"],
  "improvementAreas": ["List of 3-5 skill gaps or areas where candidates could improve"],
  "emergingSkills": ["List of 3-5 emerging/trending skills found in this pool"],
  "skillGaps": ["List of 3-5 important skills missing from most candidates"]
}

Focus on actionable insights for recruiting and talent development.
`

  try {
    const result = await model.generateContent(insightsPrompt)
    const response = await result.response
    const insightsText = response.text()
    
    // Extract JSON from the response
    let jsonText = insightsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
    }
    
    const insights = JSON.parse(jsonText)
    
    return {
      summary: {
        totalCandidates,
        averageSkillsPerCandidate,
        averageExperienceYears: Math.round(resumesData.reduce((sum, r) => sum + r.experience.length, 0) / totalCandidates),
        uniqueCompanies: allCompanies.size,
        uniqueSkills: allSkills.size
      },
      skillsAnalysis: {
        topSkills,
        emergingSkills: insights.emergingSkills || [],
        skillGaps: insights.skillGaps || []
      },
      experienceAnalysis: {
        seniorityDistribution: seniorityLevels,
        topCompanies,
        commonJobTitles
      },
      educationAnalysis: {
        topUniversities,
        degreeDistribution: degreeCounts,
        fieldDistribution: fieldCounts
      },
      marketInsights: {
        recommendedSalaryRange: insights.recommendedSalaryRange || 'Unable to determine',
        competitiveSkills: insights.competitiveSkills || [],
        improvementAreas: insights.improvementAreas || []
      }
    }
  } catch (error) {
    console.error('Error generating AI insights:', error)
    
    // Return basic analysis without AI insights
    return {
      summary: {
        totalCandidates,
        averageSkillsPerCandidate,
        averageExperienceYears: Math.round(resumesData.reduce((sum, r) => sum + r.experience.length, 0) / totalCandidates),
        uniqueCompanies: allCompanies.size,
        uniqueSkills: allSkills.size
      },
      skillsAnalysis: {
        topSkills,
        emergingSkills: [],
        skillGaps: []
      },
      experienceAnalysis: {
        seniorityDistribution: seniorityLevels,
        topCompanies,
        commonJobTitles
      },
      educationAnalysis: {
        topUniversities,
        degreeDistribution: degreeCounts,
        fieldDistribution: fieldCounts
      },
      marketInsights: {
        recommendedSalaryRange: 'Analysis unavailable',
        competitiveSkills: [],
        improvementAreas: []
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumesData } = await request.json()

    if (!resumesData || !Array.isArray(resumesData) || resumesData.length === 0) {
      return NextResponse.json({ error: 'No resume data provided' }, { status: 400 })
    }

    console.log(`Analyzing batch of ${resumesData.length} resumes`)

    const analysis = await analyzeBatchResumes(resumesData)

    return NextResponse.json({ 
      success: true, 
      analysis 
    })

  } catch (error) {
    console.error('Batch analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Enable dynamic content
export const dynamic = 'force-dynamic' 