
export interface AboutData {
  id?: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  photoUrl: string;
}

export interface EducationData {
  id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl?: string;
}

export interface ExperienceData {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl?: string;
}

export interface CertificationData {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  logoUrl?: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}
