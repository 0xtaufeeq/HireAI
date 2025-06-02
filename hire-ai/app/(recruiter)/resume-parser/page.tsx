"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Download, X, BarChart3, Users, TrendingUp, GitCompareArrows, Trophy, Target, Star, Award } from "lucide-react"
import { uploadResumes, validateResumeFile, convertToUIFormat, formatFileSize, ProcessingResult, analyzeJobMatch, JobMatchResult, CandidateScore } from "@/lib/resume-parser"
import { useToast } from "@/hooks/use-toast"

export default function ResumeParserPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedResult, setSelectedResult] = useState<ProcessingResult | null>(null)
  const [parsingResults, setParsingResults] = useState<ProcessingResult[]>([])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [isUploading, setIsUploading] = useState(false)
  const [viewMode, setViewMode] = useState<'individual' | 'batch' | 'comparison' | 'leaderboard'>('individual')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobMatchResults, setJobMatchResults] = useState<JobMatchResult | null>(null)
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const completedResults = parsingResults.filter(r => r.status === 'completed')
  const processingResults = parsingResults.filter(r => r.status === 'processing')
  const failedResults = parsingResults.filter(r => r.status === 'failed')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return

    // Validate files
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    files.forEach(file => {
      const validation = validateResumeFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`)
      }
    })

    // Show validation errors
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be uploaded",
        description: invalidFiles.join(", "),
        variant: "destructive",
      })
    }

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      // Create initial processing results for UI feedback
      const initialResults: ProcessingResult[] = validFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        fileName: file.name,
        status: 'processing',
        uploadTime: 'just now',
        progress: 0
      }))

      // Add to results immediately for UI feedback
      setParsingResults(prev => [...prev, ...initialResults])

      // Upload and process files
      const response = await uploadResumes(validFiles)

      if (response.success) {
        // Update with actual results
        setParsingResults(prev => {
          // Remove temporary results and add real ones
          const filteredPrev = prev.filter(result => !result.id.startsWith('temp-'))
          return [...filteredPrev, ...response.results]
        })

        // Select the first completed result if not in batch view
        const firstCompleted = response.results.find(r => r.status === 'completed')
        if (firstCompleted && viewMode === 'individual') {
          setSelectedResult(firstCompleted)
        }

        // Switch to batch view if multiple files were uploaded
        if (validFiles.length > 1) {
          setViewMode('batch')
        }

        toast({
          title: "Upload successful",
          description: `${response.message}. ${validFiles.length > 1 ? 'Switched to batch analysis view.' : ''}`,
        })
      } else {
        throw new Error(response.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      })

      // Remove temporary results on error
      setParsingResults(prev => prev.filter(result => !result.id.startsWith('temp-')))
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeResult = (resultId: string) => {
    setParsingResults(prev => prev.filter(result => result.id !== resultId))
    setSelectedResults(prev => {
      const newSet = new Set(prev)
      newSet.delete(resultId)
      return newSet
    })
    if (selectedResult?.id === resultId) {
      const remaining = parsingResults.filter(result => result.id !== resultId)
      setSelectedResult(remaining.length > 0 ? remaining[0] : null)
    }
  }

  const toggleResultSelection = (resultId: string) => {
    setSelectedResults(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resultId)) {
        newSet.delete(resultId)
      } else {
        newSet.add(resultId)
      }
      return newSet
    })
  }

  const selectAllCompleted = () => {
    const completedIds = completedResults.map(r => r.id)
    setSelectedResults(new Set(completedIds))
  }

  const clearSelection = () => {
    setSelectedResults(new Set())
  }

  const bulkAddToCandidatePool = () => {
    const selectedCount = selectedResults.size
    toast({
      title: "Added to candidate pool",
      description: `${selectedCount} candidate${selectedCount > 1 ? 's' : ''} added successfully.`,
    })
    clearSelection()
  }

  const bulkExport = () => {
    const selectedCount = selectedResults.size
    toast({
      title: "Export started",
      description: `Exporting data for ${selectedCount} candidate${selectedCount > 1 ? 's' : ''}.`,
    })
  }

  // New job analysis handler
  const handleJobAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to analyze candidates.",
        variant: "destructive",
      })
      return
    }

    if (completedResults.length === 0) {
      toast({
        title: "No candidates to analyze",
        description: "Please upload and process some resumes first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzingJob(true)

    try {
      const result = await analyzeJobMatch(completedResults, jobDescription, jobTitle)
      setJobMatchResults(result)
      setViewMode('leaderboard')
      
      toast({
        title: "Job analysis complete",
        description: `Analyzed ${result.totalCandidates} candidates. Average score: ${result.averageScore}%`,
      })
    } catch (error) {
      console.error('Job analysis error:', error)
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingJob(false)
    }
  }

  // Calculate batch analytics
  const batchAnalytics = {
    totalCandidates: completedResults.length,
    averageSkills: completedResults.length > 0 
      ? Math.round(completedResults.reduce((sum, r) => sum + (r.extractedData?.skills.length || 0), 0) / completedResults.length)
      : 0,
    topSkills: (() => {
      const skillCounts: { [key: string]: number } = {}
      completedResults.forEach(r => {
        r.extractedData?.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      })
      return Object.entries(skillCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([skill]) => skill)
    })(),
    experienceLevels: (() => {
      const levels: { [key: string]: number } = { 'Entry': 0, 'Mid': 0, 'Senior': 0 }
      completedResults.forEach(r => {
        const expCount = r.extractedData?.experience.length || 0
        if (expCount <= 2) levels['Entry']++
        else if (expCount <= 4) levels['Mid']++
        else levels['Senior']++
      })
      return levels
    })()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
          <p className="text-muted-foreground">Upload multiple resumes and analyze them against job descriptions using AI OCR technology.</p>
        </div>
        
        {completedResults.length > 1 && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('individual')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Individual
            </Button>
            <Button
              variant={viewMode === 'batch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('batch')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Batch Analysis
            </Button>
            <Button
              variant={viewMode === 'comparison' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('comparison')}
              disabled={selectedResults.size < 2}
            >
              <GitCompareArrows className="h-4 w-4 mr-2" />
              Compare ({selectedResults.size})
            </Button>
            {jobMatchResults && (
              <Button
                variant={viewMode === 'leaderboard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('leaderboard')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Job Description Section */}
      {completedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Job Description Analysis
            </CardTitle>
            <CardDescription>
              Enter a job description to score and rank candidates based on job fit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
            <Button 
              onClick={handleJobAnalysis}
              disabled={isAnalyzingJob || !jobDescription.trim()}
              className="w-full"
            >
              {isAnalyzingJob ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Candidates...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Analyze Job Match ({completedResults.length} candidates)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {completedResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold">{batchAnalytics.totalCandidates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg. Skills</p>
                  <p className="text-2xl font-bold">{batchAnalytics.averageSkills}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{processingResults.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                {jobMatchResults ? <Star className="h-8 w-8 text-yellow-600" /> : <AlertCircle className="h-8 w-8 text-red-600" />}
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {jobMatchResults ? 'Avg. Job Score' : 'Failed'}
                  </p>
                  <p className="text-2xl font-bold">
                    {jobMatchResults ? `${jobMatchResults.averageScore}%` : failedResults.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Multiple Resumes</CardTitle>
              <CardDescription>Drag and drop multiple PDF, Word documents, or images, or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isUploading ? "Processing with AI OCR..." : "Drop multiple resumes here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF, DOC, DOCX, and image files (JPG, PNG, etc.) up to 10MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Browse Files"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Queue */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Processing Queue</CardTitle>
                  <CardDescription>Recent uploads and their processing status with AI OCR</CardDescription>
                </div>
                {completedResults.length > 1 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllCompleted}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsingResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No resumes uploaded yet. Upload multiple files to see batch analysis.
                  </p>
                ) : (
                  parsingResults.map((result) => {
                    const candidateScore = jobMatchResults?.leaderboard.find(c => c.candidateId === result.id)
                    
                    return (
                      <div
                        key={result.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedResult?.id === result.id && viewMode === 'individual'
                            ? "border-primary bg-primary/5"
                            : selectedResults.has(result.id)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {result.status === 'completed' && (
                              <Checkbox
                                checked={selectedResults.has(result.id)}
                                onCheckedChange={() => toggleResultSelection(result.id)}
                              />
                            )}
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div
                              className="cursor-pointer flex-1"
                              onClick={() => {
                                if (viewMode === 'individual') {
                                  setSelectedResult(result)
                                }
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{result.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{result.uploadTime}</p>
                                </div>
                                {candidateScore && (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      Rank #{candidateScore.rank}
                                    </Badge>
                                    <Badge 
                                      className={`text-xs ${
                                        candidateScore.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                        candidateScore.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                      }`}
                                    >
                                      {candidateScore.score}%
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {result.status === "completed" && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {result.status === "processing" && (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Processing with OCR
                              </Badge>
                            )}
                            {result.status === "failed" && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeResult(result.id)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {result.status === "processing" && result.progress !== undefined && (
                          <Progress value={result.progress} className="mt-2" />
                        )}
                        {result.status === "failed" && result.error && (
                          <p className="text-xs text-destructive mt-2">{result.error}</p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
              
              {/* Bulk Actions */}
              {selectedResults.size > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      {selectedResults.size} candidate{selectedResults.size > 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={bulkAddToCandidatePool}>
                        Add to Pool
                      </Button>
                      <Button variant="outline" size="sm" onClick={bulkExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Leaderboard View */}
          {viewMode === 'leaderboard' && jobMatchResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Candidate Leaderboard - {jobMatchResults.jobTitle}
                </CardTitle>
                <CardDescription>
                  Candidates ranked by job match score (Average: {jobMatchResults.averageScore}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobMatchResults.leaderboard.map((candidate, index) => (
                    <div key={candidate.candidateId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {candidate.rank}
                          </div>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <Award className={`h-4 w-4 ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' :
                                'text-amber-600'
                              }`} />
                            )}
                            <span className={`text-2xl font-bold ${
                              candidate.score >= 80 ? 'text-green-600' :
                              candidate.score >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {candidate.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex justify-between">
                          <span>Skills:</span>
                          <span className="font-medium">{candidate.matchBreakdown.skillsMatch}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{candidate.matchBreakdown.experienceMatch}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Education:</span>
                          <span className="font-medium">{candidate.matchBreakdown.educationMatch}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Fit:</span>
                          <span className="font-medium">{candidate.matchBreakdown.overallFit}%</span>
                        </div>
                      </div>

                      {/* Strengths and Weaknesses */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-green-700 dark:text-green-400">Strengths:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.strengths.slice(0, 3).map((strength, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {candidate.weaknesses.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-700 dark:text-red-400">Areas for improvement:</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.weaknesses.slice(0, 2).map((weakness, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {weakness}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const result = completedResults.find(r => r.id === candidate.candidateId)
                            if (result) {
                              setSelectedResult(result)
                              setViewMode('individual')
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button size="sm">
                          Add to Pool
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Job Match Insights */}
                {jobMatchResults.matchInsights && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Hiring Insights</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">Best Skill Matches</p>
                        <div className="space-y-1">
                          {jobMatchResults.matchInsights.bestSkillMatches.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs block w-fit">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Common Gaps</p>
                        <div className="space-y-1">
                          {jobMatchResults.matchInsights.commonGaps.map((gap, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs block w-fit">
                              {gap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Recommendations</p>
                        <div className="space-y-1">
                          {jobMatchResults.matchInsights.recommendedActions.slice(0, 3).map((action, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              • {action}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {viewMode === 'individual' && selectedResult?.status === "completed" && selectedResult.extractedData && (
            <Card>
              <CardHeader>
                <CardTitle>AI OCR Results</CardTitle>
                <CardDescription>Information extracted from {selectedResult.fileName} using AI OCR</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-sm text-muted-foreground">{selectedResult.extractedData.name || 'Not found'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-muted-foreground">{selectedResult.extractedData.email || 'Not found'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-muted-foreground">{selectedResult.extractedData.phone || 'Not found'}</p>
                      </div>
                      {selectedResult.extractedData.linkedin_url && (
                        <div>
                          <label className="text-sm font-medium">LinkedIn</label>
                          <p className="text-sm text-muted-foreground">
                            <a href={selectedResult.extractedData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedResult.extractedData.linkedin_url}
                            </a>
                          </p>
                        </div>
                      )}
                      {selectedResult.extractedData.github_url && (
                        <div>
                          <label className="text-sm font-medium">GitHub</label>
                          <p className="text-sm text-muted-foreground">
                            <a href={selectedResult.extractedData.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedResult.extractedData.github_url}
                            </a>
                          </p>
                        </div>
                      )}
                      {selectedResult.extractedData.summary && (
                        <div>
                          <label className="text-sm font-medium">Summary</label>
                          <p className="text-sm text-muted-foreground">{selectedResult.extractedData.summary}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Extracted Skills</label>
                      {selectedResult.extractedData.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedResult.extractedData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills found</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Education</label>
                        {selectedResult.extractedData.education.length > 0 ? (
                          <div className="space-y-2">
                            {selectedResult.extractedData.education.map((edu, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium">{edu.degree}</p>
                                <p className="text-muted-foreground">
                                  {edu.institution}
                                  {edu.field_of_study && ` • ${edu.field_of_study}`}
                                  {edu.graduation_date && ` • ${edu.graduation_date}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No education information found</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Work History</label>
                        {selectedResult.extractedData.experience.length > 0 ? (
                          <div className="space-y-3">
                            {selectedResult.extractedData.experience.map((job, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium">{job.job_title}</p>
                                <p className="text-muted-foreground">
                                  {job.company} • {job.start_date} - {job.end_date}
                                </p>
                                {job.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No work experience found</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button>Add to Candidate Pool</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'batch' && completedResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Batch Analysis Summary</CardTitle>
                <CardDescription>Analysis across all {completedResults.length} processed resumes</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                    <TabsTrigger value="candidates">Candidates</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Experience Levels</label>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Entry Level</span>
                            <span>{batchAnalytics.experienceLevels.Entry} candidates</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Mid Level</span>
                            <span>{batchAnalytics.experienceLevels.Mid} candidates</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Senior Level</span>
                            <span>{batchAnalytics.experienceLevels.Senior} candidates</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Processing Status</label>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completed</span>
                            <span className="text-green-600">{completedResults.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Processing</span>
                            <span className="text-blue-600">{processingResults.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Failed</span>
                            <span className="text-red-600">{failedResults.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Most Common Skills</label>
                      {batchAnalytics.topSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {batchAnalytics.topSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No common skills found</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Average Skills per Candidate</label>
                      <p className="text-2xl font-bold text-primary">{batchAnalytics.averageSkills}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="candidates" className="space-y-4">
                    <div className="space-y-3">
                      {completedResults.map((result) => (
                        <div key={result.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{result.extractedData?.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{result.extractedData?.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {result.extractedData?.skills.length || 0} skills • 
                                {result.extractedData?.experience.length || 0} positions
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedResult(result)
                                setViewMode('individual')
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button onClick={bulkAddToCandidatePool}>Add All to Pool</Button>
                  <Button variant="outline" onClick={bulkExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'comparison' && selectedResults.size >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Candidate Comparison</CardTitle>
                <CardDescription>Side-by-side comparison of selected candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from(selectedResults).slice(0, 2).map(resultId => {
                    const result = completedResults.find(r => r.id === resultId)
                    if (!result?.extractedData) return null
                    
                    return (
                      <div key={resultId} className="space-y-3">
                        <h4 className="font-medium">{result.extractedData.name}</h4>
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-medium">Email:</span> {result.extractedData.email}
                          </div>
                          <div>
                            <span className="font-medium">Skills:</span> {result.extractedData.skills.length}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {result.extractedData.experience.length} positions
                          </div>
                          <div>
                            <span className="font-medium">Education:</span> {result.extractedData.education.length} entries
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.extractedData.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {result.extractedData.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{result.extractedData.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedResult?.status === "processing" && (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p className="text-lg font-medium mb-2">Processing with AI OCR</p>
                <p className="text-sm text-muted-foreground mb-4">
                  AI is extracting information from {selectedResult.fileName}
                </p>
                <Progress value={selectedResult.progress || 0} className="w-full" />
              </CardContent>
            </Card>
          )}

          {selectedResult?.status === "failed" && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <p className="text-lg font-medium mb-2">Processing Failed</p>
                <p className="text-sm text-muted-foreground mb-4">{selectedResult.error}</p>
                <Button variant="outline" onClick={() => removeResult(selectedResult.id)}>
                  Remove from Queue
                </Button>
              </CardContent>
            </Card>
          )}

          {!selectedResult && viewMode === 'individual' && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No Resume Selected</p>
                <p className="text-sm text-muted-foreground">
                  Upload multiple resumes or select one to see the AI OCR extracted information here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
