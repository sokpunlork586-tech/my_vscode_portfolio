import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'projects.config',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  demo_url?: string;
  github_url?: string;
  order: number;
}

function formatProjectsToMarkdown(projects: ProjectItem[]): string {
  let md = "### Some of the projects I've worked on so far\n\n";
  for (const p of projects) {
    const primaryLink = p.demo_url || p.github_url || `#${p.slug}`;
    md += `- [${p.title}](${primaryLink})\n\n`;
    md += `  - ${p.description}\n`;
    if (p.tags) {
      const formattedTags = p.tags
        .split(',')
        .map((t) => `\`${t.trim()}\``)
        .join(', ');
      md += `  - ${formattedTags}\n`;
    }
    const links = [];
    if (p.demo_url) links.push(`[Live Demo](${p.demo_url})`);
    if (p.github_url) links.push(`[Source Code](${p.github_url})`);
    if (links.length > 0) {
      md += `  - ${links.join(' | ')}\n`;
    }
    md += '\n';
  }
  return md;
}

export default async function ProjectsPage() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/projects?page=1&page_size=100', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const mdContent = formatProjectsToMarkdown(data.items);
        return <MDTab fileName="projects" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/projects.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="projects" initialContent={content} />;
}
