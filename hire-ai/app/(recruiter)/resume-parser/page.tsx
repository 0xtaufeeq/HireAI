"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle, Clock, AlertCircle, X, Download, Copy } from "lucide-react"
import { UploadedResume, UploadResponse } from "@/types/resume"
import { useToast } from "@/hooks/use-toast"

export default function ResumeParserPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([])
  const [selectedResume, setSelectedResume] = useState<UploadedResume | null>(null)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => uploadFile(file))
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => uploadFile(file))
  }, [])

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF or DOC files only.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive"
      })
      return
    }

    // Create temporary resume object
    const tempId = Date.now().toString()
    const tempResume: UploadedResume = {
      id: tempId,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      uploadTime: new Date().toISOString(),
      extractedText: "",
      status: "uploading"
    }

    setUploadedResumes(prev => [...prev, tempResume])

    try {
      // Update status to processing
      setUploadedResumes(prev => 
        prev.map(resume => 
          resume.id === tempId 
            ? { ...resume, status: "processing" as const }
            : resume
        )
      )

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData
      })

      const result: UploadResponse = await response.json()

      if (result.success) {
        // Update with successful result
        const updatedResume: UploadedResume = {
          id: tempId,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          uploadTime: result.uploadTime,
          extractedText: result.extractedText,
          status: "completed"
        }

        setUploadedResumes(prev => 
          prev.map(resume => 
            resume.id === tempId ? updatedResume : resume
          )
        )

        // Auto-select the uploaded resume
        setSelectedResume(updatedResume)

        toast({
          title: "Upload successful",
          description: `Successfully extracted text from ${file.name}`,
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      
      // Update with error status
      setUploadedResumes(prev => 
        prev.map(resume => 
          resume.id === tempId 
            ? { 
                ...resume, 
                status: "failed" as const, 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : resume
        )
      )

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: "destructive"
      })
    }
  }

  const removeResume = (id: string) => {
    setUploadedResumes(prev => prev.filter(resume => resume.id !== id))
    if (selectedResume?.id === id) {
      setSelectedResume(null)
    }
  }

  const copyToClipboard = () => {
    if (selectedResume?.extractedText) {
      navigator.clipboard.writeText(selectedResume.extractedText)
      toast({
        title: "Copied to clipboard",
        description: "Extracted text has been copied to your clipboard.",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  return (
    <div className="space-y-8">
      <div 
        className="space-y-2"
        style={{
          animation: `elegant-fade-in 500ms var(--ease-out-cubic)`
        }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
        <p className="text-muted-foreground/80">Upload resumes to automatically extract text content using AI-powered OCR.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card 
            className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
            style={{
              animationDelay: '100ms',
              animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
              opacity: 0
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-primary/70" />
                Upload Resumes
              </CardTitle>
              <CardDescription className="text-muted-foreground/70">
                Drag and drop PDF or Word documents, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/60 hover:border-primary/50 hover:bg-primary/2"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                <p className="text-lg font-medium mb-2 text-foreground/90">Drop resumes here</p>
                <p className="text-sm text-muted-foreground/60 mb-4">
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
                <Button variant="outline" className="button-elegant">
                  Browse Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Processing Queue */}
          <Card 
            className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
            style={{
              animationDelay: '200ms',
              animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
              opacity: 0
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary/70" />
                Processing Queue
                {uploadedResumes.length > 0 && (
                  <Badge variant="secondary" className="badge-elegant">
                    {uploadedResumes.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground/70">
                Uploaded files and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedResumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                  <p className="text-muted-foreground/60">No files uploaded yet</p>
                  <p className="text-sm text-muted-foreground/50">Upload a resume to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedResumes.map((resume, index) => (
                    <div
                      key={resume.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 group ${
                        selectedResume?.id === resume.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border/40 hover:border-border/80 hover:bg-muted/20"
                      }`}
                      onClick={() => resume.status === "completed" && setSelectedResume(resume)}
                      style={{
                        animationDelay: `${(index + 3) * 100}ms`,
                        animation: `elegant-fade-in 500ms var(--ease-out-cubic) forwards`,
                        opacity: 0
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-foreground/90 truncate">
                              {resume.originalName}
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                              {formatFileSize(resume.size)} • {formatTimeAgo(resume.uploadTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {resume.status === "completed" && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {resume.status === "processing" && (
                            <Badge variant="secondary" className="border-blue-200 dark:border-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Processing
                            </Badge>
                          )}
                          {resume.status === "uploading" && (
                            <Badge variant="secondary" className="border-yellow-200 dark:border-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Uploading
                            </Badge>
                          )}
                          {resume.status === "failed" && (
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
                              removeResume(resume.id)
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {resume.status === "processing" && (
                        <Progress value={75} className="mt-3 h-1" />
                      )}
                      {resume.status === "failed" && resume.error && (
                        <p className="text-xs text-destructive mt-2 bg-destructive/5 p-2 rounded border border-destructive/20">
                          {resume.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card 
            className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
            style={{
              animationDelay: '300ms',
              animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
              opacity: 0
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary/70" />
                  Extracted Text
                </div>
                {selectedResume && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="button-elegant h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground/70">
                {selectedResume 
                  ? `Text content extracted from ${selectedResume.originalName}`
                  : "Select a completed upload to view extracted text"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedResume ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground/60 mb-2">No resume selected</p>
                  <p className="text-sm text-muted-foreground/50">
                    Upload and process a resume to view extracted text
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    value={selectedResume.extractedText}
                    readOnly
                    className="min-h-[400px] font-mono text-sm resize-none focus-visible:ring-1"
                    placeholder="Extracted text will appear here..."
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                    <span>{selectedResume.extractedText.length} characters</span>
                    <span>Processed {formatTimeAgo(selectedResume.uploadTime)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
