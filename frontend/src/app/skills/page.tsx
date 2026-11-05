import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'skills.js',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SkillItem {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

function formatSkillsToMarkdown(items: SkillItem[]): string {
  let md = "### Technical Skills\n\n";
  const categories: Record<string, SkillItem[]> = {};
  for (const s of items) {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  }
  for (const [cat, list] of Object.entries(categories)) {
    md += `#### ${cat}\n\n`;
    for (const item of list) {
      md += `- **${item.name}** — ${item.proficiency}%\n`;
    }
    md += '\n';
  }
  return md;
}

export default async function SkillsPage() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/skills', {
      cache: 'no-store',
    });
    if (res.ok) {
      const items: SkillItem[] = await res.json();
      if (items && items.length > 0) {
        const mdContent = formatSkillsToMarkdown(items);
        return <MDTab fileName="skills" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/skills.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="skills" initialContent={content} />;
}
