import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'contact.json',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ContactInfoData {
  developer_name: string;
  professional_title: string;
  email: string;
  location: string;
  timezone: string;
  preferred_method: string;
  response_window: string;
  availability_status: string;
  github_url: string;
  linkedin_url: string;
}

function formatContactToMarkdown(contact: ContactInfoData): string {
  return [
    '### Get in Touch / Contact Me\n',
    'Feel free to reach out for software engineering inquiries, consulting, or full-time opportunities.\n',
    '---',
    `- **Developer:** ${contact.developer_name}`,
    `- **Role:** ${contact.professional_title}`,
    `- **Email:** [${contact.email}](mailto:${contact.email})`,
    `- **Status:** ${contact.availability_status}`,
    `- **Location:** ${contact.location} (${contact.timezone})`,
    `- **Preferred Contact:** ${contact.preferred_method}`,
    `- **Response Window:** ${contact.response_window}`,
    `- **GitHub:** [${contact.github_url}](${contact.github_url})`,
    `- **LinkedIn:** [${contact.linkedin_url}](${contact.linkedin_url})`,
    '',
    '---',
    '',
    '#### Contact Configuration (`contact.json`)',
    '```json',
    JSON.stringify(
      {
        developer: contact.developer_name,
        title: contact.professional_title,
        email: contact.email,
        github: contact.github_url,
        preferredMethod: contact.preferred_method,
        responseWindow: contact.response_window,
      },
      null,
      2
    ),
    '```',
    '',
  ].join('\n');
}

export default async function ContactPage() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/contact', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data: ContactInfoData = await res.json();
      if (data && data.developer_name) {
        const mdContent = formatContactToMarkdown(data);
        return <MDTab fileName="contact" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/contact.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="contact" initialContent={content} />;
}
