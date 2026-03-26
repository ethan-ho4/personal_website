import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our content based on content.json
export interface StatItem {
  label: string;
  value: string;
}

export interface HighlightItem {
  title: string;
  description: string;
  icon: string;
}

export interface HomeContent {
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  stats: StatItem[];
  highlights: HighlightItem[];
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
}

export interface ProjectsContent {
  title: string;
  subtitle: string;
  list: ProjectItem[];
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number }[];
}

export interface SkillsContent {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  year: number;
  description: string;
  achievements: string[];
  color: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
}

export interface TimelineContent {
  title: string;
  subtitle: string;
  experiences: ExperienceItem[];
}

export interface SocialsContent {
  github: string;
  linkedin: string;
  twitter: string;
  resume?: string;
}

export interface SiteContent {
  home: HomeContent;
  projects: ProjectsContent;
  skills: SkillsContent;
  contact: ContactContent;
  timeline: TimelineContent;
  socials: SocialsContent;
}

interface ContentContextType {
  content: SiteContent | null;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      setContent(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred fetching content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, refreshContent: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
