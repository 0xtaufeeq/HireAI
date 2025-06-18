export interface UploadedResume {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadTime: string;
  extractedText: string;
  status: "uploading" | "processing" | "completed" | "failed";
  error?: string;
  structuredData?: ResumeStructuredData;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  extractedText: string;
  uploadTime: string;
  error?: string;
  structuredData?: ResumeStructuredData;
}

export interface ResumeStructuredData {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  experience: string;
  summary?: string;
  skills: string[];
  education: EducationEntry[];
  workHistory: WorkExperience[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
  honors?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements?: string[];
} 