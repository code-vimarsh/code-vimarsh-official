// Re-export the global ProjectType for use within this section
export type { ProjectType } from '../../types';

// Form state used by ProjectForm
export interface ProjectFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string;            // comma-separated input; split on submit
  features: string[];           // dynamic list items
  githubUrl: string;
  imageFile: File | null;
  imagePreview: string;         // data URI for preview
  authorName: string;
  isPublished: boolean;
}

// Validation errors map
export type ProjectFormErrors = Partial<Record<keyof ProjectFormData, string>>;
