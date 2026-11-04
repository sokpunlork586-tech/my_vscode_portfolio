import React from 'react';
import type { Metadata } from 'next';
import Diploma from '@/views/Diploma';
import sweData from '@/data/json/swe.json';

const {
  metadata: { title, subtitle },
} = sweData;

export const metadata: Metadata = {
  title: subtitle ? `${title}, ${subtitle}` : title,
};

export default function SwePage() {
  return <Diploma diplomaData={sweData} />;
}
