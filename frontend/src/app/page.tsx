import React from 'react';
import type { Metadata } from 'next';
import Greeter from '@/views/Greeter';
import staticData from '@/data/json/static.json';
import contactData from '@/data/json/contact.json';
import pkg from '../../package.json';

export const metadata: Metadata = {
  title: 'Çağlar Turalı | Software Engineering Apprentice',
};

export default function HomePage() {
  return (
    <Greeter
      staticData={staticData}
      contactData={contactData}
      repoUrl={pkg.repository.url}
    />
  );
}
