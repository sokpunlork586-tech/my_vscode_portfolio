import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'experience.json',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  technologies?: string;
  company_url?: string;
  order: number;
}

function formatExperienceToMarkdown(items: ExperienceItem[]): string {
  let md = "### Professional Experience\n\n";
  for (const item of items) {
    const compLink = item.company_url ? `[${item.company}](${item.company_url})` : item.company;
    const dateRange = item.is_current || !item.end_date ? `${item.start_date} - Present` : `${item.start_date} - ${item.end_date}`;
    md += `- **${item.position}** @ ${compLink} *(${dateRange})*\n`;
    if (item.description) {
      const descLines = item.description.split('\n').filter(Boolean);
      for (const dl of descLines) {
        md += `  - ${dl.trim().replace(/^[-*]\s*/, '')}\n`;
      }
    }
    if (item.technologies) {
      const tags = item.technologies.split(',').map((t) => `\`${t.trim()}\``).join(', ');
      md += `  - Tech Stack: ${tags}\n`;
    }
    md += '\n';
  }
  return md;
}

export default async function ExperiencePage() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/experience', {
      cache: 'no-store',
    });
    if (res.ok) {
      const items: ExperienceItem[] = await res.json();
      if (items && items.length > 0) {
        const mdContent = formatExperienceToMarkdown(items);
        return <MDTab fileName="experience" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/experience.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="experience" initialContent={content} />;
}
