import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import MDTab from '@/components/MDTab';

export const metadata: Metadata = {
  title: 'skills.js',
};

export default function SkillsPage() {
  const filePath = path.join(process.cwd(), 'src/data/tabs/skills.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  return <MDTab fileName="skills" initialContent={content} />;
}
