export interface ImageFile {
  // For new images
  base64?: string;
  contentType?: string;

  // For existing images
  url?: string;          // S3 URL
  imageId?: number;       // Optional if you ever have an ID in DB

  // For UI
  preview: string;      
  isExisting?: boolean;    
}

export interface ImageUpload {
    base64: string;
    contentType: string;
}