import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'certificates.sass',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
  description?: string;
  order: number;
}

function formatCertificatesToMarkdown(items: CertificateItem[]): string {
  let md = "### Certificates that I have earned over time\n\n";
  for (const item of items) {
    const titleLink = item.credential_url ? `[${item.title}](${item.credential_url})` : item.title;
    md += `- ${titleLink}\n\n`;
    if (item.issuer) md += `  - Issuer: ${item.issuer}\n`;
    if (item.issue_date) md += `  - Issued: ${item.issue_date}\n`;
    if (item.credential_id) md += `  - Credential ID: \`${item.credential_id}\`\n`;
    if (item.description) md += `  - ${item.description}\n`;
    if (item.image_url) md += `  - [Certificate Image](${item.image_url})\n`;
    md += '\n';
  }
  return md;
}

export default async function CertificatesPage() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/certificates', {
      cache: 'no-store',
    });
    if (res.ok) {
      const items: CertificateItem[] = await res.json();
      if (items && items.length > 0) {
        const mdContent = formatCertificatesToMarkdown(items);
        return <MDTab fileName="certificates" initialContent={mdContent} />;
      }
    }
  } catch (err) {
    // Graceful fallback to static file if backend is offline
  }

  const filePath = path.join(process.cwd(), 'src/data/tabs/certificates.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="certificates" initialContent={content} />;
}
