import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';
import { API_BASE_URL } from '@/utils/api';

export const metadata: Metadata = {
  title: '.educationrc',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  description?: string;
  url?: string;
  order: number;
}

function formatEducationToMarkdown(items: EducationItem[]): string {
  let md = "### My [academic] background\n\n";
  for (const item of items) {
    const titleLink = item.url ? `[${item.institution}](${item.url})` : item.institution;
    md += `- ${titleLink}\n\n`;
    if (item.degree) md += `  - ${item.degree}\n`;
    if (item.field_of_study) md += `  - ${item.field_of_study}\n`;
    const dates = item.end_date ? `${item.start_date} - ${item.end_date}` : item.start_date;
    md += `  - ${dates}\n`;
    if (item.grade) md += `  - Grade: ${item.grade}\n`;
    if (item.description) md += `  - ${item.description}\n`;
    md += '\n';
  }
  return md;
}

export default async function EducationPage() {
  try {
    const res = await fetch(`${API_BASE_URL}/education`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const items: EducationItem[] = await res.json();
      if (items && items.length > 0) {
        const mdContent = formatEducationToMarkdown(items);
        return <MDTab fileName="education" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/education.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="education" initialContent={content} />;
}
