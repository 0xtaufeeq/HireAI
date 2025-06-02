export interface ParsedResumeData {
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

export interface ProcessingResult {
  id: string
  fileName: string
  status: 'processing' | 'completed' | 'failed'
  uploadTime: string
  extractedData?: ParsedResumeData
  error?: string
  progress?: number
}

export interface UploadResponse {
  success: boolean
  results: ProcessingResult[]
  message: string
  error?: string
  details?: string
}

export interface BatchAnalysisResult {
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

export interface CandidateScore {
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

export interface JobMatchResult {
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

/**
 * Upload and process multiple resume files
 */
export async function uploadResumes(files: File[]): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    
    // Add all files to the form data
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fetch('/api/resume-parser/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * Analyze multiple resumes for batch insights
 */
export async function analyzeBatchResumes(resumesData: ParsedResumeData[]): Promise<BatchAnalysisResult> {
  try {
    const response = await fetch('/api/resume-parser/batch-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumesData }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error('Batch analysis error:', error)
    throw error
  }
}

/**
 * Analyze candidates against a job description and get match scores
 */
export async function analyzeJobMatch(
  candidates: ProcessingResult[],
  jobDescription: string,
  jobTitle?: string
): Promise<JobMatchResult> {
  try {
    const response = await fetch('/api/resume-parser/job-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        candidates: candidates.filter(c => c.status === 'completed'),
        jobDescription,
        jobTitle 
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Job match analysis error:', error)
    throw error
  }
}

/**
 * Validate file before upload
 */
export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ]
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']

  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  // Check file type
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(fileExtension)) {
    return { valid: false, error: 'Only PDF, DOC, DOCX, and image files (JPG, PNG, GIF, BMP, WebP) are supported' }
  }

  // Additional MIME type check
  if (!allowedTypes.includes(file.type) && file.type !== '') {
    return { valid: false, error: 'Invalid file type' }
  }

  return { valid: true }
}

/**
 * Convert parsed resume data to the format expected by the existing UI
 */
export function convertToUIFormat(parsedData: ParsedResumeData) {
  return {
    name: parsedData.name,
    email: parsedData.email,
    phone: parsedData.phone,
    location: '', // Not extracted by our parser, could be added later
    title: parsedData.experience[0]?.job_title || '',
    experience: `${parsedData.experience.length} positions`,
    skills: parsedData.skills,
    education: parsedData.education.map(edu => ({
      degree: edu.degree,
      school: edu.institution,
      year: edu.graduation_date,
    })),
    workHistory: parsedData.experience.map(exp => ({
      company: exp.company,
      position: exp.job_title,
      duration: `${exp.start_date} - ${exp.end_date}`,
      description: exp.description,
    })),
    summary: parsedData.summary,
    linkedin_url: parsedData.linkedin_url,
    github_url: parsedData.github_url,
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
} 