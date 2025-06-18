export interface UploadedResume {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadTime: string;
  extractedText: string;
  status: "uploading" | "processing" | "completed" | "failed";
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  extractedText: string;
  uploadTime: string;
  error?: string;
} 