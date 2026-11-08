import React from 'react';
import type { Metadata } from 'next';
import Greeter from '@/views/Greeter';
import staticDataFallback from '@/data/json/static.json';
import contactDataFallback from '@/data/json/contact.json';
import pkg from '../../package.json';
import { Static, ContactItem } from '@/models';
import { API_BASE_URL } from '@/utils/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Punlork | Software Engineer & Full-Stack Developer',
};

export default async function HomePage() {
  let staticData: Static = staticDataFallback;
  const contactData: ContactItem[] = contactDataFallback as unknown as ContactItem[];

  try {
    const introRes = await fetch(`${API_BASE_URL}/intro`, { cache: 'no-store' });
    if (introRes.ok) {
      const data = await introRes.json();
      if (data && data.main_line) {
        staticData = {
          mainLine: data.main_line,
          typed: data.typed || staticDataFallback.typed,
        };
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  try {
    const contactRes = await fetch(`${API_BASE_URL}/contact`, { cache: 'no-store' });
    if (contactRes.ok) {
      const contact = await contactRes.json();
      if (contact && contact.email) {
        const emailContact = contactData.find((c) => c.isMain || c.name === 'Email');
        if (emailContact) {
          emailContact.url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`;
        }
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  return (
    <Greeter
      staticData={staticData}
      contactData={contactData}
      repoUrl={pkg.repository.url}
    />
  );
}
