export interface User {
  id: number;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "editor" | "viewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IntroData {
  main_line: string;
  typed: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface ProfileData {
  name: string;
  fullName?: string;
  role: string;
  status: string;
  techStack: string[];
  quickNavigation?: NavItem[];
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  demo_url?: string;
  github_url?: string;
  image_url?: string;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  page_size: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  order: number;
  created_at: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface MessageListResponse {
  items: Message[];
  total: number;
  unread_count: number;
}

export interface MetricItem {
  title: string;
  value: string;
  change: number;
  description: string;
}

export interface MonthlyDataPoint {
  month: string;
  visitors: number;
  pageviews: number;
  contacts: number;
}

export interface DashboardOverview {
  metrics: Record<string, MetricItem>;
  traffic_trends: MonthlyDataPoint[];
  projects_count: number;
  skills_count: number;
  unread_messages: number;
  system_status: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date: string;
  grade?: string;
  description?: string;
  url?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  technologies: string;
  company_url?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
  description?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  developer_name: string;
  professional_title: string;
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  preferred_method: string;
  response_window: string;
  availability_status: string;
  github_url: string;
  linkedin_url: string;
  bio_note?: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  username: string;
  order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
